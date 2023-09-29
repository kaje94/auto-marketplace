import daisyui from "daisyui";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            // backgroundImage: {
            //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            //   "gradient-conic":
            //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            // },
        },
    },
    plugins: [
        daisyui,
        plugin(function ({ addUtilities }) {
            addUtilities({
                ".zoom-inner-image": {
                    [`&:hover .zoomable-image`]: { transform: "scale(1.05)" },
                    [`&:hover .zoomable-cover-image`]: { transform: "scale(1.02)" },
                    [`&:hover .badge-hover-translucent`]: { opacity: 0.9 },
                },
                ".hero-bg": { "background-color": "#000033" },
                ".image-text-shadow": { textShadow: `0 0 25px #00000080` },
            });
        }),
    ],
    daisyui: {
        themes: ["bumblebee"],
        logs: false
    },
};
