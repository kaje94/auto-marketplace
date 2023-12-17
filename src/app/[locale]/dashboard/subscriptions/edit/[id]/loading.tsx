import { BreadCrumbs } from "@/components/Common";
import { SubscriptionForm } from "@/components/Forms/ListingSubscriptions/SubscriptionForm";

export default function Loading() {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Manage Subscriptions", href: "/dashboard/subscriptions" }]}
            />
            <SubscriptionForm isLoading />
        </>
    );
}
