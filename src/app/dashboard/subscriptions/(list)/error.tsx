"use client";
import { ErrorComponent } from "@/app/_components";

const AllSubscriptionErrorPage = (props: { error: Error; reset: () => void }) => {
    return <ErrorComponent {...props} />;
};

export default AllSubscriptionErrorPage;
