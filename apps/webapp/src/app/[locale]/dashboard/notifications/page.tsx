import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import qs from "query-string";
import { getUserNotificationsAction } from "@/actions/notificationActions";
import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardNotificationsFilterButton } from "@/components/Dashboard/DashboardListHeader/DashboardNotificationsFilterButton";
import { DashboardNotificationsList } from "@/components/Dashboard/DashboardNotifications";
import { DashboardNotificationsContextProvider } from "@/providers/DashboardNotificationsContextProvider";
import { UserNotificationsFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = UserNotificationsFilterSchema.parse(searchParams);
    const session = await getSession();
    const notificationsRes = await getUserNotificationsAction(
        { page: { pageNumber: Number(page), pageSize: 10 }, filters: { userFilters: parsedSearchParams } },
        session?.user?.email!,
    );

    if (notificationsRes.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/dashboard/notifications?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardNotificationsContextProvider>
            <DashboardListHeader filter={<DashboardNotificationsFilterButton />} itemCount={notificationsRes.page?.totalCount} />
            <DashboardNotificationsList
                basePath="/dashboard/notifications"
                currentPageNumber={Number(page) || 1}
                notifications={notificationsRes?.items}
                paginatedResponse={notificationsRes.page}
                userClaims={session?.user}
            />
        </DashboardNotificationsContextProvider>
    );
}
