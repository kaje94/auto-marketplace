import { redirect } from "next/navigation";
import qs from "query-string";
import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardAllSubscriptionFilter } from "@/components/DashboardListHeader/DashboardAllSubscriptionFilter";
import { DashboardAllSubscriptionList } from "@/components/DashboardSubscriptions/DashboardSubscriptionList";
import { DashboardSubscriptionsContextProvider } from "@/providers/dashboard-subscriptions-provider";
import { api } from "@/utils/api";
import { DashboardSubscriptionFilterSchema } from "@/utils/schemas";
import { SearchParams } from "@/utils/types";

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
