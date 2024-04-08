import { Metadata } from "next";
import { getSubscriptionItemAction } from "@/actions/userSubscriptionActions";
import { BreadCrumbs } from "@/components/Common";
import { EditSubscriptionForm } from "@/components/Forms/ListingSubscriptions/EditSubscriptionForm";
import { SubscriptionIdPathParam } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Edit Subscription", alternates: {} };

export default async function Page({ params }: SubscriptionIdPathParam) {
    const subscriptionDetails = await getSubscriptionItemAction(params.id);

    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Manage Subscriptions", href: "/dashboard/subscriptions" }]}
            />
            <EditSubscriptionForm subscriptionItem={subscriptionDetails} successRedirectPath="/dashboard/subscriptions" />
        </>
    );
}
