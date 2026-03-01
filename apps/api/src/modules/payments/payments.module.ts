import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { StripeWebhookController } from './webhooks/stripe-webhook.controller';
import { OrdersModule } from '../orders/orders.module';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [OrdersModule, MailModule],
    providers: [PaymentsService],
    controllers: [PaymentsController, StripeWebhookController],
})
export class PaymentsModule { }
