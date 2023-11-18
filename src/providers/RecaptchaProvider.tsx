"use client";

import dynamic from "next/dynamic";
import React from "react";

const ReCaptchaProvider = dynamic(() => import("next-recaptcha-v3").then((mod) => mod.ReCaptchaProvider), {
    ssr: false,
});

export const RecaptchaProvider = ({ children }: React.PropsWithChildren) => {
    return <ReCaptchaProvider>{children}</ReCaptchaProvider>;
};
