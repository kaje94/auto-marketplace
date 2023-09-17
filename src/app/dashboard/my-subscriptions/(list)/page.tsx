import { DashboardSubscriptionItem } from "@/app/_components/DashboardSubscriptionItem";
import { BreadCrumbs, Empty, Pagination, DashboardListHeader } from "@/app/_components";
import { api } from "@/utils/api";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { DashboardMySubscriptionFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { DashboardMySubscriptionFilter } from "@/app/_components/DashboardListHeader/DashboardMySubscriptionFilter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";

const MySubscriptionsPage = async ({ searchParams }: SearchParams) => {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardMySubscriptionFilterSchema.parse(searchParams);
    const session = await getServerSession(authOptions);
    const listingSubscriptions = await api.getMyListingSubscriptions(session?.user?.id!, { PageNumber: Number(page), ...parsedSearchParams });
    const hasSearchParams = Object.keys(DashboardMySubscriptionFilterSchema.parse(parsedSearchParams)).length > 0;

    if (listingSubscriptions.items?.length === 0 && page !== "1") {
        redirect(`/dashboard/my-subscriptions?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <>
            <DashboardListHeader
                itemCount={listingSubscriptions.totalCount}
                filter={<DashboardMySubscriptionFilter />}
                addNewButton={{ label: "New Subscription", path: "/dashboard/new-subscription" }}
            />

            <div className="grid gap-1 xl:gap-2">
                {listingSubscriptions.totalCount === 0 && (
                    <Empty
                        text={
                            hasSearchParams
                                ? "No advert subscriptions to display. Please adjust your search filters."
                                : "You have not created any advert subscriptions yet. Get started by creating your first advert subscription"
                        }
                    />
                )}
                {listingSubscriptions.items?.map((item) => (
                    <DashboardSubscriptionItem
                        key={item.id}
                        listingSubscriptionItem={item}
                        basePath="/dashboard/my-subscriptions"
                        isAdmin={session?.user?.isAdmin}
                    />
                ))}
                {listingSubscriptions.totalPages > 1 && (
                    <Pagination
                        pageNumber={listingSubscriptions.pageNumber}
                        totalPages={listingSubscriptions.totalPages}
                        basePath="/dashboard/my-subscriptions"
                        searchParams={searchParams}
                    />
                )}
            </div>
        </>
    );
};

export default MySubscriptionsPage;
