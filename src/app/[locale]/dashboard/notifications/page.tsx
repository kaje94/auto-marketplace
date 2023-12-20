import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import qs from "query-string";
import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardNotificationsFilterButton } from "@/components/Dashboard/DashboardListHeader/DashboardNotificationsFilterButton";
import { DashboardNotificationsList } from "@/components/Dashboard/DashboardNotifications";
import { DashboardNotificationsContextProvider } from "@/providers/DashboardNotificationsContextProvider";
import { api } from "@/utils/api";
import { DashboardNotificationsFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardNotificationsFilterSchema.parse(searchParams);
    const session = await getSession();
    const notifications = await api.getMyNotifications(session?.user?.sub!, { PageNumber: Number(page), ...parsedSearchParams });
    if (notifications.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/dashboard/notifications?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardNotificationsContextProvider>
            <DashboardListHeader filter={<DashboardNotificationsFilterButton />} itemCount={notifications.totalCount} />
            <DashboardNotificationsList basePath="/dashboard/notifications" notifications={notifications} userClaims={session?.user} />
        </DashboardNotificationsContextProvider>
    );
}
