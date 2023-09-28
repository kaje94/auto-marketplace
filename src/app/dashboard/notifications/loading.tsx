import { DashboardListHeader } from "@/app/_components";
import { DashboardNotificationsList } from "@/app/_components/DashboardNotifications";

export default function Loading() {
    return (
        <>
            <DashboardListHeader loading />
            <DashboardNotificationsList pageLoading />
        </>
    );
}
