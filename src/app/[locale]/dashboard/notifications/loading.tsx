import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardNotificationsList } from "@/components/Dashboard/DashboardNotifications";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardNotificationsList pageLoading />
        </>
    );
}
