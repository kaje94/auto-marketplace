import { DashboardListHeader } from "@/components";
import { DashboardMySubscriptionList } from "@/components/DashboardSubscriptions/DashboardSubscriptionList";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardMySubscriptionList pageLoading />
        </>
    );
}
