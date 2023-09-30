import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        API_BASE_URL: z.string().min(1),
        S3_UPLOAD_KEY: z.string().min(1),
        S3_UPLOAD_SECRET: z.string().min(1),
        S3_UPLOAD_BUCKET: z.string().min(1),
        S3_UPLOAD_REGION: z.string().min(1),
        AUTH0_SECRET: z.string().min(1),
        AUTH0_BASE_URL: z.string().min(1),
        AUTH0_ISSUER_BASE_URL: z.string().min(1),
        AUTH0_CLIENT_ID: z.string().min(1),
        AUTH0_CLIENT_SECRET: z.string().min(1),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_IMAGE_CDN_BASE: z.string().url(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        API_BASE_URL: process.env.API_BASE_URL,
        S3_UPLOAD_KEY: process.env.S3_UPLOAD_KEY,
        S3_UPLOAD_SECRET: process.env.S3_UPLOAD_SECRET,
        S3_UPLOAD_BUCKET: process.env.S3_UPLOAD_BUCKET,
        S3_UPLOAD_REGION: process.env.S3_UPLOAD_REGION,
        AUTH0_SECRET: process.env.S3_UPLOAD_REGION,
        AUTH0_BASE_URL: process.env.S3_UPLOAD_REGION,
        AUTH0_ISSUER_BASE_URL: process.env.S3_UPLOAD_REGION,
        AUTH0_CLIENT_ID: process.env.S3_UPLOAD_REGION,
        AUTH0_CLIENT_SECRET: process.env.S3_UPLOAD_REGION,
        NEXT_PUBLIC_IMAGE_CDN_BASE: process.env.NEXT_PUBLIC_IMAGE_CDN_BASE,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
     * This is especially useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
