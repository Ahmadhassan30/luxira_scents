/** @type {import('next').NextConfig} */
const nextConfig = {
    // Required for Docker production standalone builds
    output: 'standalone',

    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'res.cloudinary.com' },
        ],
        formats: ['image/avif', 'image/webp'],
    },

    experimental: {
        typedRoutes: true,
    },

    // Security headers applied to all routes
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                ],
            },
        ];
    },
};

export default nextConfig;
