import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardMySubscriptionList } from "@/components/DashboardSubscriptions";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardMySubscriptionList pageLoading />
        </>
    );
}
