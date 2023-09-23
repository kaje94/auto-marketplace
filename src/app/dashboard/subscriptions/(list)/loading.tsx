import { DashboardListHeader } from "@/app/_components";
import { DashboardAllSubscriptionList } from "@/app/_components/DashboardSubscriptions/DashboardSubscriptionList";

const AllSubscriptionsLoading = () => {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardAllSubscriptionList pageLoading />
        </>
    );
};

export default AllSubscriptionsLoading;
