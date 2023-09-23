import { DashboardListHeader } from "@/app/_components";
import { api } from "@/utils/api";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { DashboardSubscriptionFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { DashboardAllSubscriptionFilter } from "@/app/_components/DashboardListHeader/DashboardAllSubscriptionFilter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { DashboardSubscriptionsContextProvider } from "@/providers/dashboard-subscriptions-provider";
import { DashboardAllSubscriptionList } from "@/app/_components/DashboardSubscriptions/DashboardSubscriptionList";

export default async function Page({ searchParams }: SearchParams) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardSubscriptionFilterSchema.parse(searchParams);
    const [session, listingSubscriptions] = await Promise.all([
        getServerSession(authOptions),
        api.getListingSubscriptions({ PageNumber: Number(page), ...parsedSearchParams }),
    ]);

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
            <DashboardAllSubscriptionList listingSubscriptions={listingSubscriptions} session={session} basePath="/dashboard/subscriptions" />
        </DashboardSubscriptionsContextProvider>
    );
}
