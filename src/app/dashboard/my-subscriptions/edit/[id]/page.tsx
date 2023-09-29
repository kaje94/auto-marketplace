import { BreadCrumbs } from "@/components/Common";
import { EditSubscriptionForm } from "@/components/Forms/ListingSubscriptions/EditSubscriptionForm";
import { api } from "@/utils/api";
import { SubscriptionIdPathParam } from "@/utils/types";

export default async function Page({ params }: SubscriptionIdPathParam) {
    const subscriptionDetails = await api.getMyListingSubscriptionItem(params.id);

    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Subscriptions", href: "/dashboard/my-subscriptions" }]}
            />
            <EditSubscriptionForm listingSubscriptionItem={subscriptionDetails} successRedirectPath="/dashboard/my-subscriptions" />
        </>
    );
}
