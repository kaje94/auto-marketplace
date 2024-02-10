import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { EditSubscriptionForm } from "@/components/Forms/ListingSubscriptions/EditSubscriptionForm";
import { api } from "@/utils/api";
import { SubscriptionIdPathParam } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Edit Subscription", alternates: {} };

export default async function Page({ params }: SubscriptionIdPathParam) {
    const [subscriptionDetails, vehicleBrands] = await Promise.all([api.getMyListingSubscriptionItem(params.id), api.getVehicleBrands()]);

    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Subscriptions", href: "/dashboard/my-subscriptions" }]}
            />
            <EditSubscriptionForm
                brands={vehicleBrands}
                listingSubscriptionItem={subscriptionDetails}
                successRedirectPath="/dashboard/my-subscriptions"
            />
        </>
    );
}
