import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

interface OrderItem {
    productName: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
}

interface OrderConfirmationProps {
    orderNumber: string;
    customerName: string;
    items: OrderItem[];
    subtotal: number;
    shippingAmount: number;
    total: number;
    orderUrl: string;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
    orderNumber,
    customerName,
    items,
    subtotal,
    shippingAmount,
    total,
    orderUrl,
}) => (
    <Html>
        <Head />
        <Preview>Your Luxira Scents order #{orderNumber} has been confirmed</Preview>
        <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
            <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                <Heading style={{ color: '#1a1a1a' }}>Order Confirmed</Heading>
                <Text>Dear {customerName},</Text>
                <Text>Thank you for your order. Here's a summary:</Text>
                <Section>
                    <Text style={{ fontWeight: 'bold' }}>Order #{orderNumber}</Text>
                    {items.map((item, i) => (
                        <Text key={i}>
                            {item.productName} ({item.variantLabel}) × {item.quantity} — $
                            {(item.unitPrice * item.quantity).toFixed(2)}
                        </Text>
                    ))}
                    <Hr />
                    <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
                    <Text>Shipping: ${shippingAmount.toFixed(2)}</Text>
                    <Text style={{ fontWeight: 'bold' }}>Total: ${total.toFixed(2)}</Text>
                </Section>
                <Button href={orderUrl} style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '12px 24px' }}>
                    View Order
                </Button>
            </Container>
        </Body>
    </Html>
);

export default OrderConfirmation;
