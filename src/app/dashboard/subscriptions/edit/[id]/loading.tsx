import { BreadCrumbs } from "@/app/_components";
import { SubscriptionForm } from "@/app/_components/Forms/ListingSubscriptions/SubscriptionForm";

const SubscriptionsFormLoading = () => {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "All Subscriptions", href: "/dashboard/subscriptions" }]}
            />
            <SubscriptionForm isLoading />
        </>
    );
};

export default SubscriptionsFormLoading;
