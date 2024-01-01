import Script from "next/script";
import { env } from "@/env.mjs";

/** Monitor errors and report to Sentry */
export const ErrorMonitor = () => {
    return (
        <>{env.NEXT_PUBLIC_SENTRY_KEY && <Script crossOrigin="anonymous" src={`https://js.sentry-cdn.com/${env.NEXT_PUBLIC_SENTRY_KEY}.min.js`} />}</>
    );
};
