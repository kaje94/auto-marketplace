import { DashboardListHeader } from "@/app/_components";
import { DashboardMySubscriptionList } from "@/app/_components/DashboardSubscriptions/DashboardSubscriptionList";

const MySubscriptionsLoading = () => {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardMySubscriptionList pageLoading />
        </>
    );
};

export default MySubscriptionsLoading;
