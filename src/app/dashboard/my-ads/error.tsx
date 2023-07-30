"use client";
import { ErrorComponent } from "@/app/_components";

const MyAdsErrorPage = (props: { error: Error; reset: () => void }) => {
    return <ErrorComponent {...props} />;
};

export default MyAdsErrorPage;
