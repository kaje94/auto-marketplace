import { BreadCrumbs } from "@/components/Common";
import { EditSubscriptionForm } from "@/components/Forms/ListingSubscriptions/EditSubscriptionForm";
import { api } from "@/utils/api";
import { SubscriptionIdPathParam } from "@/utils/types";

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
