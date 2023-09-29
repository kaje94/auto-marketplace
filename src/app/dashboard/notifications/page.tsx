import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import qs from "query-string";
import { authOptions } from "@/auth/authConfig";
import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardNotificationsFilter } from "@/components/DashboardListHeader/DashboardNotificationsFilter";
import { DashboardNotificationsList } from "@/components/DashboardNotifications";
import { DashboardNotificationsContextProvider } from "@/providers/dashboard-notifications-provider";
import { api } from "@/utils/api";
import { DashboardNotificationsFilterSchema } from "@/utils/schemas";
import { SearchParams } from "@/utils/types";

export default async function Page({ searchParams }: SearchParams) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardNotificationsFilterSchema.parse(searchParams);
    const session = await getServerSession(authOptions);
    const notifications = await api.getMyNotifications(session?.user?.id!, { PageNumber: Number(page), ...parsedSearchParams });
    if (notifications.items?.length === 0 && page !== "1") {
        redirect(`/dashboard/notifications?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardNotificationsContextProvider>
            <DashboardListHeader filter={<DashboardNotificationsFilter />} itemCount={notifications.totalCount} />
            <DashboardNotificationsList basePath="/dashboard/notifications" notifications={notifications} session={session} />
        </DashboardNotificationsContextProvider>
    );
}
