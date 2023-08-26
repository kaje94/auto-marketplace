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
                    { title: "My Adverts", href: "/dashboard/ny-listings" },
                    { title: "Advert Item" },
                ]}
            />
            <ErrorComponent {...props} />
        </>
    );
};

export default ListingEditErrorPage;
