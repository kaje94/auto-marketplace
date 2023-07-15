/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    images: {
        // TODO: Remove this once image upload has been implemented
        unoptimized: true,
    },
    experimental: {
        serverActions: true,
    },
    /** Linting and typechecking are already done as separate tasks in the CI pipeline */
    // eslint: {
    //   ignoreDuringBuilds: true,
    // },
    // typescript: {
    //   ignoreBuildErrors: true,
    // },
};
export default config;
