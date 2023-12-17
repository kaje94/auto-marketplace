"use client";
import { BreadCrumbs } from "@/components/Common";
import { ListingDetailBanner, ListingDetails } from "@/components/ListingDetails";
import { useScopedI18n } from "@/locales/client";

export default function Loading() {
    const tBreadcrumbs = useScopedI18n("breadcrumbs");
    const tCommon = useScopedI18n("common");
    return (
        <>
            <BreadCrumbs
                currentPageTitle={tCommon("loading")}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { title: tBreadcrumbs("dashboard") },
                    { title: tBreadcrumbs("myAdverts"), href: "/dashboard/my-listings" },
                ]}
            />
            <ListingDetailBanner loading={true} />
            <ListingDetails showSellerDetails={false} withinDashboard={true} loading />
        </>
    );
}
