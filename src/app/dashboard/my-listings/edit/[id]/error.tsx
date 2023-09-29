"use client";
import { BreadCrumbs, ErrorComponent } from "@/components";
import { ErrorPageProps } from "@/utils/types";

export default function Error(props: ErrorPageProps) {
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
}
