"use server";
import { env } from "@/env.mjs";

/** Validate recaptcha token with Google */
export const validateRecaptchaAction = async (token: string) => {
    const formData = new FormData();
    formData.append("secret", env.RECAPTCHA_SITE_SECRET!);
    formData.append("response", token);

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        body: formData,
    });
    const responseJson: RecaptchaErrorResponse | RecaptchaSuccessResponse = await res.json();

    if (responseJson.success && responseJson.score >= 0.7) {
        return true;
    }
    throw new Error("Failed to validate with Recaptcha");
};

interface RecaptchaErrorResponse {
    "error-codes": string[];
    success: false;
}

interface RecaptchaSuccessResponse {
    action: string;
    challenge_ts: string;
    hostname: string;
    score: number;
    success: true;
}
