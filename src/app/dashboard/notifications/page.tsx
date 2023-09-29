import { DashboardListHeader } from "@/components";
import { api, apiTags } from "@/utils/api";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { DashboardNotificationsFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { DashboardNotificationsFilter } from "@/components/DashboardListHeader/DashboardNotificationsFilter";
import { DashboardNotificationsContextProvider } from "@/providers/dashboard-notifications-provider";
import { DashboardNotificationsList } from "@/components/DashboardNotifications";

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
            <DashboardListHeader itemCount={notifications.totalCount} filter={<DashboardNotificationsFilter />} />
            <DashboardNotificationsList notifications={notifications} basePath="/dashboard/notifications" session={session} />
        </DashboardNotificationsContextProvider>
    );
}
