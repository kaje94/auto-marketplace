import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardAllSubscriptionList } from "@/components/DashboardSubscriptions";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardAllSubscriptionList pageLoading />
        </>
    );
}
