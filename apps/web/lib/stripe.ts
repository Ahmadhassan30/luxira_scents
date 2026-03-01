import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

/**
 * Returns a singleton Stripe.js instance.
 * Call this wherever you need to initialize Stripe Elements.
 * The publishable key is never secret — it's safe to expose in browser code.
 */
export function getStripe(): Promise<Stripe | null> {
    if (!stripePromise) {
        const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!key) throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set');
        stripePromise = loadStripe(key);
    }
    return stripePromise;
}
