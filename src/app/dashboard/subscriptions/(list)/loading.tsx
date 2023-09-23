import { DashboardListHeader } from "@/app/_components";
import { DashboardAllSubscriptionList } from "@/app/_components/DashboardSubscriptions/DashboardSubscriptionList";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardAllSubscriptionList pageLoading />
        </>
    );
}
