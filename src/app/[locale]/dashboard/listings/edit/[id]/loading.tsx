"use client";
import { BreadCrumbs } from "@/components/Common";
import { ListingForm } from "@/components/Forms/Listings/ListingForm";
import { useScopedI18n } from "@/locales/client";

export default function Loading() {
    const tBreadcrumbs = useScopedI18n("breadcrumbs");

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tBreadcrumbs("edit")}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { title: tBreadcrumbs("dashboard") },
                    { title: tBreadcrumbs("manageAdverts"), href: "/dashboard/listings" },
                    { title: tBreadcrumbs("advertItem") },
                ]}
            />
            <ListingForm isLoading />
        </>
    );
}
