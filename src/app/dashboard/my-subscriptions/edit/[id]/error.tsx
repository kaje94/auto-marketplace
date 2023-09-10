"use client";
import { BreadCrumbs, ErrorComponent } from "@/app/_components";

const MySubscriptionsEditErrorPage = (props: { error: Error; reset: () => void }) => {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Subscriptions", href: "/dashboard/my-subscriptions" }]}
            />
            <ErrorComponent {...props} />
        </>
    );
};

export default MySubscriptionsEditErrorPage;
