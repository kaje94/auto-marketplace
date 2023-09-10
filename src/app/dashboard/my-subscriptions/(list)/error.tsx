"use client";
import { ErrorComponent } from "@/app/_components";

const MySubscriptionErrorPage = (props: { error: Error; reset: () => void }) => {
    return <ErrorComponent {...props} />;
};

export default MySubscriptionErrorPage;
