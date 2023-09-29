import { DashboardListHeader } from "@/components";
import { api } from "@/utils/api";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { DashboardSubscriptionFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { DashboardAllSubscriptionFilter } from "@/components/DashboardListHeader/DashboardAllSubscriptionFilter";
import { DashboardSubscriptionsContextProvider } from "@/providers/dashboard-subscriptions-provider";
import { DashboardAllSubscriptionList } from "@/components/DashboardSubscriptions/DashboardSubscriptionList";

export default async function Page({ searchParams }: SearchParams) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardSubscriptionFilterSchema.parse(searchParams);
    const listingSubscriptions = await api.getListingSubscriptions({ PageNumber: Number(page), ...parsedSearchParams });

    if (listingSubscriptions.items?.length === 0 && page !== "1") {
        redirect(`/dashboard/subscriptions?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardSubscriptionsContextProvider>
            <DashboardListHeader
                itemCount={listingSubscriptions.totalCount}
                filter={<DashboardAllSubscriptionFilter />}
                addNewButton={{ label: "New Subscription", path: "/dashboard/new-subscription" }}
            />
            <DashboardAllSubscriptionList listingSubscriptions={listingSubscriptions} basePath="/dashboard/subscriptions" />
        </DashboardSubscriptionsContextProvider>
    );
}
