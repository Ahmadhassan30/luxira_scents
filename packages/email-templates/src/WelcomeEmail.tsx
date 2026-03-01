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

interface WelcomeEmailProps {
    customerName: string;
    shopUrl: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ customerName, shopUrl }) => (
    <Html>
        <Head />
        <Preview>Welcome to Luxira Scents</Preview>
        <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
            <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
                <Heading style={{ color: '#1a1a1a' }}>Welcome to Luxira Scents</Heading>
                <Text>Dear {customerName},</Text>
                <Text>
                    Welcome to Luxira Scents — your destination for premium, artisanal fragrances. We're
                    thrilled to have you as a member of our community.
                </Text>
                <Button
                    href={shopUrl}
                    style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '12px 24px' }}
                >
                    Explore Our Collection
                </Button>
            </Container>
        </Body>
    </Html>
);

export default WelcomeEmail;
