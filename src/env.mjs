import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        NEXTAUTH_SECRET: z.string().min(1),
        NEXTAUTH_URL: z.preprocess(
            // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
            // Since NextAuth.js automatically uses the VERCEL_URL if present.
            (str) => process.env.VERCEL_URL ?? str,
            // VERCEL_URL doesn't include `https` so it cant be validated as a URL
            process.env.VERCEL ? z.string().min(1) : z.string().url()
        ),
        IDENTITY_BASE_URL: z.string().url(),
        IDENTITY_CLIENT_ID: z.string().min(1),
        IDENTITY_CLIENT_SECRET: z.string().min(1),
        API_BASE_URL: z.string().min(1),
        S3_UPLOAD_KEY: z.string().min(1),
        S3_UPLOAD_SECRET: z.string().min(1),
        S3_UPLOAD_BUCKET: z.string().min(1),
        S3_UPLOAD_REGION: z.string().min(1),
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
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        IDENTITY_BASE_URL: process.env.IDENTITY_BASE_URL,
        IDENTITY_CLIENT_ID: process.env.IDENTITY_CLIENT_ID,
        IDENTITY_CLIENT_SECRET: process.env.IDENTITY_CLIENT_SECRET,
        API_BASE_URL: process.env.API_BASE_URL,
        S3_UPLOAD_KEY: process.env.S3_UPLOAD_KEY,
        S3_UPLOAD_SECRET: process.env.S3_UPLOAD_SECRET,
        S3_UPLOAD_BUCKET: process.env.S3_UPLOAD_BUCKET,
        S3_UPLOAD_REGION: process.env.S3_UPLOAD_REGION,
        NEXT_PUBLIC_IMAGE_CDN_BASE: process.env.NEXT_PUBLIC_IMAGE_CDN_BASE,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
     * This is especially useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
