import daisyui from "daisyui";
import plugin from "tailwindcss/plugin";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                hero: "#000033",
            },
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
                    [`&:hover .image-hover-tint`]: { opacity: 0 },
                },
                ".animate-fadeIn-300": {
                    opacity: 0,
                    animation: "fadeIn 300ms ease-in-out",
                    "animation-fill-mode": "forwards" /* Keeps the final state of the animation */,
                },
                ".image-text-shadow": { textShadow: `0 0 25px #00000080` },
                ".animate-delay-100": { "animation-delay": "100ms" },
                ".animate-delay-200": { "animation-delay": "200ms" },
                ".animate-delay-300": { "animation-delay": "300ms" },
                ".animate-delay-400": { "animation-delay": "400ms" },
                ".animate-delay-500": { "animation-delay": "500ms" },
            });
        }),
    ],
    daisyui: {
        themes: ["bumblebee"],
        logs: false,
    },
};
