/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
    reactStrictMode: true,
    images: {
        domains: [
            // todo: check and remove below
            "lh3.googleusercontent.com",
            `${process.env.S3_UPLOAD_BUCKET}.s3.amazonaws.com`,
            `${process.env.S3_UPLOAD_BUCKET}.s3.${process.env.S3_UPLOAD_REGION}.amazonaws.com`,
        ],
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
