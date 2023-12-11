import { BreadCrumbs } from "@/components/Common";
import { EditSubscriptionForm } from "@/components/Forms/ListingSubscriptions/EditSubscriptionForm";
import { getScopedI18n } from "@/locales/server";
import { api } from "@/utils/api";
import { SubscriptionIdPathParam } from "@/utils/types";

export default async function Page({ params }: SubscriptionIdPathParam) {
    const [subscriptionDetails, vehicleBrands, tBreadcrumbs] = await Promise.all([
        api.getMyListingSubscriptionItem(params.id),
        api.getVehicleBrands(),
        getScopedI18n("breadcrumbs"),
    ]);

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
            <EditSubscriptionForm
                brands={vehicleBrands}
                listingSubscriptionItem={subscriptionDetails}
                successRedirectPath="/dashboard/subscriptions"
            />
        </>
    );
}
