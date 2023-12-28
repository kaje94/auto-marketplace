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
    experimental: {
        // Enable once its available in next.js stage release
        // ppr: true,
    },
    eslint: {
        // Will be tested separately in the CI pipeline
        ignoreDuringBuilds: true,
    },
};
export default config;
