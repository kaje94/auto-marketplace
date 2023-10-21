import { BreadCrumbs } from "@/components/Common";
import { SubscriptionForm } from "@/components/Forms/ListingSubscriptions/SubscriptionForm";

export default function Loading() {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Subscriptions", href: "/dashboard/my-subscriptions" }]}
            />
            <SubscriptionForm isLoading />
        </>
    );
}
