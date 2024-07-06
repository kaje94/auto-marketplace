import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        GRPC_API_BASE_URL: z.string().optional().default("http://localhost:3001"),
        AUTH0_SECRET: z.string().min(1),
        AUTH0_BASE_URL: z.string().min(1),
        AUTH0_ISSUER_BASE_URL: z.string().min(1),
        AUTH0_CLIENT_ID: z.string().min(1),
        AUTH0_CLIENT_SECRET: z.string().min(1),
        AUTH0_SCOPE: z.string().min(1),
        NEXT_CONTACT_US_FORM_KEY: z.string().optional(),
        RECAPTCHA_SITE_SECRET: z.string().optional(),
        IMAGE_CDN_BASE: z.string().url().optional(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_SUPPORT_EMAIL: z.string().optional().default("support@targabay.com"),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    experimental__runtimeEnv: {
        NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
     * This is especially useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    onValidationError: (error) => {
        console.error("❌ Invalid environment variables:", error.flatten().fieldErrors);
        throw new Error("Invalid environment variables");
    },
});
