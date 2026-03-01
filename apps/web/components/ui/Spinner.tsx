export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = { sm: 'w-4 h-4', md: 'w-7 h-7', lg: 'w-10 h-10' };
    return (
        <div
            role="status"
            aria-label="Loading"
            className={`${sizes[size]} border-2 border-gold/20 border-t-gold rounded-full animate-spin`}
        />
    );
}
