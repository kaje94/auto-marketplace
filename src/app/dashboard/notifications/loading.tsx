import { DashboardListHeader } from "@/components";
import { DashboardNotificationsList } from "@/components/DashboardNotifications";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardNotificationsList pageLoading />
        </>
    );
}
