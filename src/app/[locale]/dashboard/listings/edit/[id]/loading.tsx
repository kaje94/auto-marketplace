import { BreadCrumbs } from "@/components/Common";
import { ListingForm } from "@/components/Forms/Listings/ListingForm";
import { getScopedI18n } from "@/locales/server";

export default async function Loading() {
    const tBreadcrumbs = await getScopedI18n("breadcrumbs");

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
