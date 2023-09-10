import { api } from "@/utils/api";
import { BreadCrumbs } from "@/app/_components";
import { ListingIdType } from "@/utils/types";
import { EditSubscriptionForm } from "@/app/_components/Forms/ListingSubscriptions/EditSubscriptionForm";

const EditMySubscriptionsPage = async ({ params }: { params: { id: ListingIdType } }) => {
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
};

export default EditMySubscriptionsPage;
