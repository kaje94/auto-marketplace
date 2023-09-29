/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        formats: ["image/avif", "image/webp"],
        domains: ["ik.imagekit.io"],
    },
    experimental: {
        serverActions: true,
    },
};
export default config;
