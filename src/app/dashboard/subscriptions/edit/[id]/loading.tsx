import { BreadCrumbs } from "@/app/_components";
import { SubscriptionForm } from "@/app/_components/Forms/ListingSubscriptions/SubscriptionForm";

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
