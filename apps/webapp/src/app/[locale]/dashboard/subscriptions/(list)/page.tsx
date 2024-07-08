import { redirect } from "next/navigation";
import qs from "query-string";
import { getAllSubscriptionsAction } from "@/actions/adminSubscriptionActions";
import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardAllSubscriptionFilterButton } from "@/components/Dashboard/DashboardListHeader/DashboardAllSubscriptionFilterButton";
import { DashboardAllSubscriptionList } from "@/components/Dashboard/DashboardSubscriptions/DashboardSubscriptionList";
import { DashboardAllSubscriptionsProvider } from "@/providers/DashboardAllSubscriptionsProvider";
import { AdminSubscriptionsFilterSchema, UserSubscriptionsFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const userFilters = UserSubscriptionsFilterSchema.parse(searchParams);
    const adminFilters = AdminSubscriptionsFilterSchema.parse(searchParams);

    const subscriptionsResp = await getAllSubscriptionsAction({
        page: { pageNumber: Number(page), pageSize: 10 },
        filters: { userFilters, adminFilters },
    });

    if (subscriptionsResp.items?.length === 0 && page !== "1") {
        redirect(
            `/${params.locale}/dashboard/subscriptions?${qs.stringify({ ...userFilters, ...adminFilters, PageNumber: 1 }, { skipEmptyString: true })}`,
        );
    }

    return (
        <DashboardAllSubscriptionsProvider>
            <DashboardListHeader
                addNewButton={{ label: "New Subscription", path: "/dashboard/new-subscription" }}
                filter={<DashboardAllSubscriptionFilterButton />}
                itemCount={subscriptionsResp.page?.totalCount}
            />
            <DashboardAllSubscriptionList
                basePath="/dashboard/subscriptions"
                currentPageNumber={Number(page) || 1}
                paginatedResponse={subscriptionsResp.page}
                subscriptions={subscriptionsResp.items}
            />
        </DashboardAllSubscriptionsProvider>
    );
}
