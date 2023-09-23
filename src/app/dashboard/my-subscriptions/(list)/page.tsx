import { DashboardListHeader } from "@/app/_components";
import { api } from "@/utils/api";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { DashboardMySubscriptionFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { DashboardMySubscriptionFilter } from "@/app/_components/DashboardListHeader/DashboardMySubscriptionFilter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { DashboardMySubscriptionList } from "@/app/_components/DashboardSubscriptions/DashboardSubscriptionList";
import { DashboardSubscriptionsContextProvider } from "@/providers/dashboard-my-subscriptions-provider";

const MySubscriptionsPage = async ({ searchParams }: SearchParams) => {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardMySubscriptionFilterSchema.parse(searchParams);
    const session = await getServerSession(authOptions);
    const listingSubscriptions = await api.getMyListingSubscriptions(session?.user?.id!, { PageNumber: Number(page), ...parsedSearchParams });

    if (listingSubscriptions.items?.length === 0 && page !== "1") {
        redirect(`/dashboard/my-subscriptions?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardSubscriptionsContextProvider>
            <DashboardListHeader
                itemCount={listingSubscriptions.totalCount}
                filter={<DashboardMySubscriptionFilter />}
                addNewButton={{ label: "New Subscription", path: "/dashboard/new-subscription" }}
            />
            <DashboardMySubscriptionList listingSubscriptions={listingSubscriptions} session={session} basePath="/dashboard/my-subscriptions" />
        </DashboardSubscriptionsContextProvider>
    );
};

export default MySubscriptionsPage;
