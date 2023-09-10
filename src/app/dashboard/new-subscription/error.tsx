"use client";
import { ErrorComponent } from "@/app/_components";

const SubscriptionErrorPage = (props: { error: Error; reset: () => void }) => {
    return <ErrorComponent {...props} />;
};

export default SubscriptionErrorPage;
