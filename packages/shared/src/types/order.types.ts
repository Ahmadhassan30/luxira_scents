import { OrderStatus } from '../constants/order-status';

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    productVariantId: string;
    quantity: number;
    unitPrice: number;
    productName: string;
    variantLabel: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    userId?: string;
    guestEmail?: string;
    status: OrderStatus;
    subtotal: number;
    discountAmount: number;
    shippingAmount: number;
    total: number;
    stripePaymentIntentId?: string;
    trackingNumber?: string;
    trackingCarrier?: string;
    notes?: string;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderSummary {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    itemCount: number;
    createdAt: string;
}
