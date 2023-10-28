/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    images: {
        formats: ["image/avif", "image/webp"],
        domains: ["ik.imagekit.io"],
    },
};
export default config;
