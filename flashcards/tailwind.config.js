import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
    ],
    plugins: [daisyui],
    daisyui: {
        themes: ["light", "dark", "cupcake"]
    },
    theme: {
        extend: {
            animation: {
                zoomIn: 'zoomIn 0.5s ease-in-out',
            },
            keyframes: {
                zoomIn: {
                    '0%': {
                        transform: 'scale(0.5)',
                        opacity: '0',
                    },
                    '100%': {
                        transform: 'scale(1)',
                        opacity: '1',
                    },
                },
            },
        },
    },
}
