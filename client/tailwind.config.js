/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                wood: {
                    50: '#efebe9',
                    100: '#d7ccc8',
                    200: '#bcaaa4',
                    300: '#a1887f',
                    400: '#8d6e63',
                    500: '#795548',
                    600: '#6d4c41',
                    700: '#5d4037',
                    800: '#4e342e',
                    900: '#3e2723',
                },
                gold: {
                    400: '#fdd835',
                    500: '#fbc02d',
                    600: '#f9a825',
                }
            },
            fontFamily: {
                sans: ['"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
