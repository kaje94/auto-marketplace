import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardAllSubscriptionList } from "@/components/Dashboard/DashboardSubscriptions";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardAllSubscriptionList pageLoading />
        </>
    );
}
