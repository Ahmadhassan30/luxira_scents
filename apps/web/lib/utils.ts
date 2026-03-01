import { type ClassValue, clsx } from 'clsx';

// Lightweight cn() implementation without installing clsx as dep — use native approach
export function cn(...inputs: (string | undefined | null | boolean | Record<string, boolean>)[]): string {
    return inputs
        .filter(Boolean)
        .map((i) => {
            if (typeof i === 'object' && i !== null) {
                return Object.entries(i)
                    .filter(([, v]) => v)
                    .map(([k]) => k)
                    .join(' ');
            }
            return i;
        })
        .join(' ')
        .trim();
}

/**
 * Format a price number to USD currency string.
 * Use this everywhere prices from the API are displayed.
 */
export function formatPrice(amount: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
}

/**
 * Convert a Prisma Decimal (which may arrive serialized as a string "19.99")
 * to a plain JS number. Guards against both string and number inputs.
 */
export function toNumber(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value);
    if (value && typeof (value as Record<string, unknown>).toNumber === 'function') {
        return (value as { toNumber(): number }).toNumber();
    }
    return 0;
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export function truncate(text: string, length: number): string {
    return text.length > length ? text.slice(0, length) + '…' : text;
}
