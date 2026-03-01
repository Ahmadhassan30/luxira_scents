import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as React from 'react';
import { OrderConfirmation } from '@perfume/email-templates';

@Injectable()
export class MailService {
    private readonly resend: Resend;
    private readonly from: string;
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly config: ConfigService) {
        this.resend = new Resend(this.config.getOrThrow<string>('RESEND_API_KEY'));
        this.from = this.config.get<string>('EMAIL_FROM', 'noreply@luxirascents.com');
    }

    async sendOrderConfirmation(
        to: string,
        order: {
            orderNumber: string;
            items: Array<{
                productName: string;
                variantLabel: string;
                quantity: number;
                unitPrice: { toNumber(): number } | number;
            }>;
            subtotal: { toNumber(): number } | number;
            shippingAmount: { toNumber(): number } | number;
            total: { toNumber(): number } | number;
            user?: { firstName?: string | null } | null;
        },
    ) {
        const toNumber = (v: { toNumber(): number } | number) =>
            typeof v === 'number' ? v : v.toNumber();

        try {
            await this.resend.emails.send({
                from: this.from,
                to,
                subject: `Order Confirmed — #${order.orderNumber}`,
                react: React.createElement(OrderConfirmation, {
                    orderNumber: order.orderNumber,
                    customerName: order.user?.firstName ?? 'Valued Customer',
                    items: order.items.map((i) => ({
                        productName: i.productName,
                        variantLabel: i.variantLabel,
                        quantity: i.quantity,
                        unitPrice: toNumber(i.unitPrice),
                    })),
                    subtotal: toNumber(order.subtotal),
                    shippingAmount: toNumber(order.shippingAmount),
                    total: toNumber(order.total),
                    orderUrl: `${process.env.FRONTEND_URL}/account/orders`,
                }),
            });
        } catch (err) {
            // Mail is non-critical — log but don't throw. Order is already confirmed.
            this.logger.error(`Failed to send order confirmation to ${to}`, (err as Error).message);
        }
    }

    async sendPasswordReset(to: string, resetUrl: string, name?: string) {
        try {
            const { PasswordReset } = await import('@perfume/email-templates');
            await this.resend.emails.send({
                from: this.from,
                to,
                subject: 'Reset Your Password — Luxira Scents',
                react: React.createElement(PasswordReset, {
                    customerName: name ?? 'Valued Customer',
                    resetUrl,
                }),
            });
        } catch (err) {
            this.logger.error(`Failed to send password reset to ${to}`, (err as Error).message);
        }
    }

    async sendWelcome(to: string, name?: string) {
        try {
            const { WelcomeEmail } = await import('@perfume/email-templates');
            await this.resend.emails.send({
                from: this.from,
                to,
                subject: 'Welcome to Luxira Scents',
                react: React.createElement(WelcomeEmail, {
                    customerName: name ?? 'Valued Customer',
                    shopUrl: `${process.env.FRONTEND_URL}/products`,
                }),
            });
        } catch (err) {
            this.logger.error(`Failed to send welcome email to ${to}`, (err as Error).message);
        }
    }
}
