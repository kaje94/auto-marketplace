"use client";
import { ErrorComponent } from "@/app/_components";

const AllAdsErrorPage = (props: { error: Error; reset: () => void }) => {
    return <ErrorComponent {...props} />;
};

export default AllAdsErrorPage;
