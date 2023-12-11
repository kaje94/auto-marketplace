import { BreadCrumbs } from "@/components/Common";
import { SubscriptionForm } from "@/components/Forms/ListingSubscriptions/SubscriptionForm";
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
                    { title: tBreadcrumbs("manageSubscriptions"), href: "/dashboard/subscriptions" },
                ]}
            />
            <SubscriptionForm isLoading />
        </>
    );
}
