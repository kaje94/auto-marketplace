"use client";
import { BreadCrumbs, ErrorComponent } from "@/app/_components";

const MyAdsErrorPage = (props: { error: Error; reset: () => void }) => {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="item"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Adverts", href: "/dashboard/listings" }]}
            />
            <ErrorComponent {...props} />
        </>
    );
};

export default MyAdsErrorPage;
