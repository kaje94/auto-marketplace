"use client";
import { BreadCrumbs, ErrorComponent } from "@/app/_components";

const ListingEditErrorPage = (props: { error: Error; reset: () => void }) => {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[
                    { href: "/", title: "Home" },
                    { title: "Dashboard" },
                    { title: "Manage Adverts", href: "/dashboard/listings" },
                    { title: "Advert Item" },
                ]}
            />
            <ErrorComponent {...props} />
        </>
    );
};

export default ListingEditErrorPage;
