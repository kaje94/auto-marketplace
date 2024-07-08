import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import qs from "query-string";
import { getUserSubscriptionsAction } from "@/actions/userSubscriptionActions";
import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardMySubscriptionFilterButton } from "@/components/Dashboard/DashboardListHeader/DashboardMySubscriptionFilterButton";
import { DashboardMySubscriptionList } from "@/components/Dashboard/DashboardSubscriptions/DashboardSubscriptionList";
import { DashboardMySubscriptionsContextProvider } from "@/providers/DashboardMySubscriptionsContextProvider";
import { UserSubscriptionsFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const userFilters = UserSubscriptionsFilterSchema.parse(searchParams);

    const session = await getSession();

    const subscriptionsResp = await getUserSubscriptionsAction(
        {
            page: { pageNumber: Number(page), pageSize: 10 },
            filters: { userFilters },
        },
        session?.user?.email!,
    );

    if (subscriptionsResp.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/dashboard/my-subscriptions?${qs.stringify({ ...userFilters, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardMySubscriptionsContextProvider>
            <DashboardListHeader
                addNewButton={{ label: "New Subscription", path: "/dashboard/new-subscription" }}
                filter={<DashboardMySubscriptionFilterButton />}
                itemCount={subscriptionsResp.page?.totalCount}
            />
            <DashboardMySubscriptionList
                basePath="/dashboard/my-subscriptions"
                currentPageNumber={Number(page) || 1}
                paginatedResponse={subscriptionsResp.page}
                subscriptions={subscriptionsResp.items}
            />
        </DashboardMySubscriptionsContextProvider>
    );
}
