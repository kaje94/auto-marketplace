import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardMySubscriptionList } from "@/components/Dashboard/DashboardSubscriptions";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardMySubscriptionList pageLoading />
        </>
    );
}
