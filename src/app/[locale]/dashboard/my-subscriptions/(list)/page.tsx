import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import qs from "query-string";
import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardMySubscriptionFilterButton } from "@/components/DashboardListHeader/DashboardMySubscriptionFilterButton";
import { DashboardMySubscriptionList } from "@/components/DashboardSubscriptions/DashboardSubscriptionList";
import { getScopedI18n } from "@/locales/server";
import { DashboardMySubscriptionsContextProvider } from "@/providers/DashboardMySubscriptionsContextProvider";
import { api } from "@/utils/api";
import { DashboardMySubscriptionFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardMySubscriptionFilterSchema.parse(searchParams);
    const [session, tBreadcrumbs] = await Promise.all([getSession(), getScopedI18n("breadcrumbs")]);
    const listingSubscriptions = await api.getMyListingSubscriptions(session?.user?.sub!, { PageNumber: Number(page), ...parsedSearchParams });

    if (listingSubscriptions.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/dashboard/my-subscriptions?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardMySubscriptionsContextProvider>
            <DashboardListHeader
                addNewButton={{ label: tBreadcrumbs("newSubscription"), path: "/dashboard/new-subscription" }}
                filter={<DashboardMySubscriptionFilterButton />}
                itemCount={listingSubscriptions.totalCount}
            />
            <DashboardMySubscriptionList basePath="/dashboard/my-subscriptions" listingSubscriptions={listingSubscriptions} />
        </DashboardMySubscriptionsContextProvider>
    );
}
