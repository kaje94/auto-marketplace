"use client";
import { BreadCrumbs, ErrorComponent } from "@/app/_components";

const MyAdsErrorPage = (props: { error: Error; reset: () => void }) => {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Advert Item"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Manage Adverts", href: "/dashboard/listings" }]}
            />
            <ErrorComponent {...props} />
        </>
    );
};

export default MyAdsErrorPage;
