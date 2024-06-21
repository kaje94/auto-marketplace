import { getSession } from "@auth0/nextjs-auth0";
import { Metadata } from "next";
import { getMyProfileAction } from "@/actions/profileActions";
import { getSubscriptionItemAction } from "@/actions/userSubscriptionActions";
import { BreadCrumbs } from "@/components/Common";
import { EditSubscriptionForm } from "@/components/Forms/ListingSubscriptions/EditSubscriptionForm";
import { SubscriptionIdPathParam } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Edit Subscription", alternates: {} };

export default async function Page({ params }: SubscriptionIdPathParam) {
    const session = await getSession();
    const [subscriptionDetails, profile] = await Promise.all([getSubscriptionItemAction(params.id), getMyProfileAction(session?.user?.email!)]);

    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Manage Subscriptions", href: "/dashboard/subscriptions" }]}
            />
            <EditSubscriptionForm profile={profile} subscriptionItem={subscriptionDetails} successRedirectPath="/dashboard/subscriptions" />
        </>
    );
}
