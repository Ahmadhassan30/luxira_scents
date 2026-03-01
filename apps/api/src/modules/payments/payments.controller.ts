import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller({ path: 'payments', version: '1' })
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('create-intent/:orderId')
    @ApiOperation({ summary: 'Create a Stripe PaymentIntent for an order — returns client_secret' })
    createIntent(
        @Param('orderId') orderId: string,
        @CurrentUser('sub') userId: string,
    ) {
        return this.paymentsService.createPaymentIntent(orderId, userId);
    }
}
