import { DashboardListHeader } from "@/app/_components";
import { DashboardMySubscriptionList } from "@/app/_components/DashboardSubscriptions/DashboardSubscriptionList";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardMySubscriptionList pageLoading />
        </>
    );
}
