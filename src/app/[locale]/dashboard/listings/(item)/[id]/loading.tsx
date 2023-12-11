import { BreadCrumbs } from "@/components/Common";
import { ListingDetailBanner, ListingDetails } from "@/components/ListingDetails";
import { getScopedI18n } from "@/locales/server";

export default async function Loading() {
    const [tBreadcrumbs, tCommon] = await Promise.all([getScopedI18n("breadcrumbs"), getScopedI18n("common")]);

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tCommon("loading")}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { title: tBreadcrumbs("dashboard") },
                    { title: tBreadcrumbs("manageAdverts"), href: "/dashboard/listings" },
                ]}
            />
            <ListingDetailBanner loading={true} />
            <ListingDetails withinDashboard={true} loading />
        </>
    );
}
