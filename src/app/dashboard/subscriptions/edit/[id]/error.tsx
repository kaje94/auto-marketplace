"use client";
import { BreadCrumbs, ErrorComponent } from "@/app/_components";

const SubscriptionsEditErrorPage = (props: { error: Error; reset: () => void }) => {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Manage Subscriptions", href: "/dashboard/subscriptions" }]}
            />
            <ErrorComponent {...props} />
        </>
    );
};

export default SubscriptionsEditErrorPage;
