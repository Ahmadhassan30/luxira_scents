import { z } from 'zod';

export const createOrderSchema = z.object({
    items: z
        .array(
            z.object({
                variantId: z.string().uuid(),
                quantity: z.number().int().min(1),
            }),
        )
        .min(1, 'At least one item is required'),
    shippingAddressId: z.string().uuid().optional(),
    couponCode: z.string().optional(),
    guestEmail: z.string().email().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
