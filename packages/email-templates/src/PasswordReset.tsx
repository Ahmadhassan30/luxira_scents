import * as React from 'react';
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
} from '@react-email/components';

interface PasswordResetProps {
    customerName: string;
    resetUrl: string;
}

export const PasswordReset: React.FC<PasswordResetProps> = ({ customerName, resetUrl }) => (
    <Html>
        <Head />
        <Preview>Reset your Luxira Scents password</Preview>
        <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
            <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                <Heading style={{ color: '#1a1a1a' }}>Password Reset Request</Heading>
                <Text>Dear {customerName},</Text>
                <Text>
                    We received a request to reset your password. Click the button below to set a new
                    password. This link expires in 1 hour.
                </Text>
                <Button
                    href={resetUrl}
                    style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '12px 24px' }}
                >
                    Reset Password
                </Button>
                <Text style={{ color: '#666', fontSize: '12px' }}>
                    If you did not request a password reset, please ignore this email.
                </Text>
            </Container>
        </Body>
    </Html>
);

export default PasswordReset;
