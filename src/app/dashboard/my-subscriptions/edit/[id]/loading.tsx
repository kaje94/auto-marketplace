import { BreadCrumbs } from "@/app/_components";
import { SubscriptionForm } from "@/app/_components/Forms/ListingSubscriptions/SubscriptionForm";

const MySubscriptionFormLoading = () => {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Subscriptions", href: "/dashboard/my-subscriptions" }]}
            />
            <SubscriptionForm isLoading />
        </>
    );
};

export default MySubscriptionFormLoading;
