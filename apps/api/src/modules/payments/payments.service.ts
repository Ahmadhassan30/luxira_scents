import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
    private readonly stripe: Stripe;

    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        this.stripe = new Stripe(this.config.getOrThrow<string>('stripe.secretKey'), {
            apiVersion: '2024-04-10',
        });
    }

    /**
     * Creates a Stripe PaymentIntent for the given order.
     * The client secret returned is used by Stripe Elements (card data never touches our server).
     */
    async createPaymentIntent(orderId: string, userId: string) {
        const order = await this.prisma.order.findFirst({
            where: { id: orderId, userId, status: 'PENDING' },
        });
        if (!order) throw new BadRequestException('Order not found or not eligible for payment');

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(order.total.toNumber() * 100), // Stripe amounts in cents
            currency: 'usd',
            metadata: { orderId: order.id, orderNumber: order.orderNumber },
            automatic_payment_methods: { enabled: true },
        });

        // Store the PaymentIntent ID so webhook can match it back to the order
        await this.prisma.order.update({
            where: { id: orderId },
            data: { stripePaymentIntentId: paymentIntent.id },
        });

        return { clientSecret: paymentIntent.client_secret };
    }

    getStripeInstance(): Stripe {
        return this.stripe;
    }

    getWebhookSecret(): string {
        return this.config.getOrThrow<string>('stripe.webhookSecret');
    }
}
