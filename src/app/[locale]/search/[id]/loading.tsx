import { BreadCrumbs } from "@/components/Common";
import { ListingDetails } from "@/components/ListingDetails";
import { ListingsCarousel } from "@/components/ListingsCarousel";
import { getScopedI18n } from "@/locales/server";

export default async function Loading() {
    const tCommon = await getScopedI18n("common");
    const tBreadcrumbs = await getScopedI18n("breadcrumbs");
    const tPostedListItem = await getScopedI18n("appRouter.postedListItemRoute");

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tCommon("loading")}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { href: "/search", title: tBreadcrumbs("search") },
                ]}
            />
            <ListingDetails loading />
            <div className="divider mt-16">{tPostedListItem("relatedAdvertsTitle")}</div>
            <ListingsCarousel loading />
        </>
    );
}
