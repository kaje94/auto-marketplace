import { api } from "@/utils/api";
import { BreadCrumbs } from "@/components/Common";
import { SubscriptionIdPathParam } from "@/utils/types";
import { EditSubscriptionForm } from "@/components/Forms/ListingSubscriptions/EditSubscriptionForm";

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
