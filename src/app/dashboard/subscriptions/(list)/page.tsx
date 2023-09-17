import { DashboardSubscriptionItem } from "@/app/_components/DashboardSubscriptionItem";
import { BreadCrumbs, Empty, Pagination, DashboardListHeader } from "@/app/_components";
import { api } from "@/utils/api";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { DashboardSubscriptionFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { DashboardAllSubscriptionFilter } from "@/app/_components/DashboardListHeader/DashboardAllSubscriptionFilter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";

const SubscriptionsPage = async ({ searchParams }: SearchParams) => {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardSubscriptionFilterSchema.parse(searchParams);
    const session = await getServerSession(authOptions);
    const listingSubscriptions = await api.getListingSubscriptions({ PageNumber: Number(page), ...parsedSearchParams });

    if (listingSubscriptions.items?.length === 0 && page !== "1") {
        redirect(`/dashboard/subscriptions?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <>
            <DashboardListHeader
                itemCount={listingSubscriptions.totalCount}
                filter={<DashboardAllSubscriptionFilter />}
                addNewButton={{ label: "New Subscription", path: "/dashboard/new-subscription" }}
            />

            <div className="grid gap-1 xl:gap-2">
                {listingSubscriptions.totalCount === 0 && <Empty text={"No adverts to display. Please adjust your search filters."} />}
                {listingSubscriptions.items?.map((item) => (
                    <DashboardSubscriptionItem
                        key={item.id}
                        listingSubscriptionItem={item}
                        basePath="/dashboard/subscriptions"
                        isAdmin={session?.user?.isAdmin}
                    />
                ))}
                {listingSubscriptions.totalPages > 1 && (
                    <Pagination
                        pageNumber={listingSubscriptions.pageNumber}
                        totalPages={listingSubscriptions.totalPages}
                        basePath="/dashboard/subscriptions"
                        searchParams={searchParams}
                    />
                )}
            </div>
        </>
    );
};

export default SubscriptionsPage;
