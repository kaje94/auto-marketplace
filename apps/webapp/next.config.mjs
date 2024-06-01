import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    nx: {
        // Set this to true if you would like to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr: false,
    },
    experimental: {
        // Enable once its available in next.js stage release
        // ppr: true,
        // this includes files from the monorepo base two directories up
        outputFileTracingRoot: join(__dirname, "../../"),
    },
    eslint: {
        // Will be tested separately in the CI pipeline
        ignoreDuringBuilds: true,
    },
    output: "standalone",
    // cleanDistDir: true,
};
export default config;
