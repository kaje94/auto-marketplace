import { DashboardListHeader } from "@/components";
import { DashboardAllSubscriptionList } from "@/components/DashboardSubscriptions/DashboardSubscriptionList";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardAllSubscriptionList pageLoading />
        </>
    );
}
