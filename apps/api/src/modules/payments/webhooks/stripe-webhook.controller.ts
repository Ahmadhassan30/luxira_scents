import {
    Controller,
    Post,
    Req,
    Res,
    HttpCode,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import Stripe from 'stripe';
import { PaymentsService } from '../payments.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { MailService } from '../../mail/mail.service';
import { Public } from '../../../common/decorators/public.decorator';

/**
 * Stripe webhook controller — separate from PaymentsController intentionally.
 *
 * CRITICAL: This route needs the raw (unparsed) request body for HMAC signature verification.
 * main.ts routes `/api/v1/payments/webhook` through express.raw() BEFORE the JSON middleware.
 * If you ever change the Stripe webhook URL, update main.ts to match.
 *
 * Card data NEVER reaches this endpoint — Stripe Elements handles that entirely.
 * This endpoint only receives event notifications (payment_intent.succeeded, etc.)
 */
@ApiTags('Payments')
@Controller({ path: 'payments', version: '1' })
export class StripeWebhookController {
    private readonly logger = new Logger(StripeWebhookController.name);

    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly prisma: PrismaService,
        private readonly mail: MailService,
    ) { }

    @Public()
    @Post('webhook')
    @HttpCode(HttpStatus.OK)
    @ApiExcludeEndpoint()
    async handleWebhook(@Req() req: Request, @Res() res: Response) {
        const sig = req.headers['stripe-signature'] as string;
        let event: Stripe.Event;

        try {
            // req.body here is the raw Buffer because main.ts applied express.raw() for this path
            event = this.paymentsService
                .getStripeInstance()
                .webhooks.constructEvent(req.body as Buffer, sig, this.paymentsService.getWebhookSecret());
        } catch (err) {
            this.logger.error('Stripe webhook signature verification failed', (err as Error).message);
            res.status(HttpStatus.BAD_REQUEST).send(`Webhook Error: ${(err as Error).message}`);
            return;
        }

        try {
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
                    break;
                default:
                    this.logger.log(`Unhandled Stripe event: ${event.type}`);
            }
        } catch (err) {
            this.logger.error(`Failed to process Stripe event ${event.type}`, (err as Error).message);
            // Return 200 anyway — prevents Stripe from retrying events we can't process
        }

        res.json({ received: true });
    }

    private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
        const order = await this.prisma.order.update({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: { status: 'PROCESSING' },
            include: { items: true, user: true },
        });

        const email = order.user?.email ?? order.guestEmail;
        if (email) {
            await this.mail.sendOrderConfirmation(email, order);
        }

        this.logger.log(`Order ${order.orderNumber} confirmed payment`);
    }

    private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
        await this.prisma.order.update({
            where: { stripePaymentIntentId: paymentIntent.id },
            data: { status: 'CANCELLED' },
        });
        this.logger.warn(`Payment failed for intent ${paymentIntent.id}`);
    }
}
