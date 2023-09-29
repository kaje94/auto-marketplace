import { api } from "@/utils/api";
import { BreadCrumbs } from "@/components";
import { SubscriptionIdPathParam } from "@/utils/types";
import { EditSubscriptionForm } from "@/components/Forms/ListingSubscriptions/EditSubscriptionForm";

export default async function Page({ params }: SubscriptionIdPathParam) {
    const subscriptionDetails = await api.getListingSubscriptionItem(params.id);

    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Manage Subscriptions", href: "/dashboard/subscriptions" }]}
            />
            <EditSubscriptionForm listingSubscriptionItem={subscriptionDetails} successRedirectPath="/dashboard/subscriptions" />
        </>
    );
}
