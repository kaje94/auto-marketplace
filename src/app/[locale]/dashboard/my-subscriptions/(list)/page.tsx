import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import qs from "query-string";
import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardMySubscriptionFilter } from "@/components/DashboardListHeader/DashboardMySubscriptionFilter";
import { DashboardMySubscriptionList } from "@/components/DashboardSubscriptions/DashboardSubscriptionList";
import { DashboardSubscriptionsContextProvider } from "@/providers/dashboard-my-subscriptions-provider";
import { api } from "@/utils/api";
import { DashboardMySubscriptionFilterSchema } from "@/utils/schemas";
import { SearchParams } from "@/utils/types";

export default async function Page({ searchParams }: SearchParams) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardMySubscriptionFilterSchema.parse(searchParams);
    const session = await getSession();
    const listingSubscriptions = await api.getMyListingSubscriptions(session?.user?.sub!, { PageNumber: Number(page), ...parsedSearchParams });

    if (listingSubscriptions.items?.length === 0 && page !== "1") {
        redirect(`/dashboard/my-subscriptions?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardSubscriptionsContextProvider>
            <DashboardListHeader
                addNewButton={{ label: "New Subscription", path: "/dashboard/new-subscription" }}
                filter={<DashboardMySubscriptionFilter />}
                itemCount={listingSubscriptions.totalCount}
            />
            <DashboardMySubscriptionList basePath="/dashboard/my-subscriptions" listingSubscriptions={listingSubscriptions} />
        </DashboardSubscriptionsContextProvider>
    );
}
