import { redirect } from "next/navigation";
import qs from "query-string";
import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardAllSubscriptionFilterButton } from "@/components/Dashboard/DashboardListHeader/DashboardAllSubscriptionFilterButton";
import { DashboardAllSubscriptionList } from "@/components/Dashboard/DashboardSubscriptions/DashboardSubscriptionList";
import { DashboardAllSubscriptionsProvider } from "@/providers/DashboardAllSubscriptionsProvider";
import { api } from "@/utils/api";
import { DashboardSubscriptionFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardSubscriptionFilterSchema.parse(searchParams);
    const listingSubscriptions = await api.getListingSubscriptions({ PageNumber: Number(page), ...parsedSearchParams });

    if (listingSubscriptions.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/dashboard/subscriptions?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardAllSubscriptionsProvider>
            <DashboardListHeader
                addNewButton={{ label: "New Subscription", path: "/dashboard/new-subscription" }}
                filter={<DashboardAllSubscriptionFilterButton />}
                itemCount={listingSubscriptions.totalCount}
            />
            <DashboardAllSubscriptionList basePath="/dashboard/subscriptions" listingSubscriptions={listingSubscriptions} />
        </DashboardAllSubscriptionsProvider>
    );
}
