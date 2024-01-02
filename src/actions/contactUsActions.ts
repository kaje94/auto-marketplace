"use server";
import { env } from "@/env.mjs";

/** Submit the contact us form to via web3forms */
export const submitContactUsFormAction = async (values: { email: string; message: string; name: string; subject: string }) => {
    const data = JSON.stringify({
        access_key: env.NEXT_CONTACT_US_FORM_KEY,
        email: values.email,
        message: values.message,
        name: values.name,
        subject: `Targabay | ${values.subject}`,
    });
    const formResponse = await fetch("https://api.web3forms.com/submit", {
        body: data,
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        method: "POST",
    });
    return formResponse.json();
};
