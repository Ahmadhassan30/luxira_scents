import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './app/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './lib/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    DEFAULT: '#B8965A',
                    light: '#D4AF7A',
                    dark: '#8B6F3E',
                },
                obsidian: {
                    DEFAULT: '#0A0A0A',
                    soft: '#141414',
                    muted: '#1E1E1E',
                },
                cream: {
                    DEFAULT: '#F5F0E8',
                    warm: '#EDE4D3',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                serif: ['var(--font-playfair)', 'Georgia', 'serif'],
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                shimmer: {
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            animation: {
                fadeIn: 'fadeIn 0.4s ease-out forwards',
                shimmer: 'shimmer 1.5s infinite',
            },
        },
    },
    plugins: [],
};
export default config;
