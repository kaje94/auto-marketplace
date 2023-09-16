import { api } from "@/utils/api";
import { BreadCrumbs } from "@/app/_components";
import { ListingIdType } from "@/utils/types";
import { EditSubscriptionForm } from "@/app/_components/Forms/ListingSubscriptions/EditSubscriptionForm";

const EditListingPage = async ({ params }: { params: { id: ListingIdType } }) => {
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
};

export default EditListingPage;
