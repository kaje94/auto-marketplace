import { BreadCrumbs, Empty, Pagination, DashboardListHeader, DashboardListingItem } from "@/app/_components";
import { api } from "@/utils/api";
import { transformListingResponse, transformListingsListResponse } from "@/utils/helpers";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { MyListingsFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { DashboardMyListFilter } from "@/app/_components/DashboardListHeader/DashboardMyListFilter";

const MyAds = async ({ searchParams }: SearchParams) => {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = MyListingsFilterSchema.parse(searchParams);
    const session = await getServerSession(authOptions);
    const listings = transformListingsListResponse(await api.getMyListings(session?.user?.id!, { PageNumber: Number(page), ...parsedSearchParams }));
    const hasSearchParams = Object.keys(MyListingsFilterSchema.parse(parsedSearchParams)).length > 0;

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/dashboard/my-listings?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <>
            <DashboardListHeader
                itemCount={listings.totalCount}
                filter={<DashboardMyListFilter />}
                addNewButton={{ label: "New Advert", path: "/dashboard/new-listing" }}
            />

            <div className="grid gap-1 xl:gap-2">
                {listings.totalCount === 0 && (
                    <Empty
                        text={
                            hasSearchParams
                                ? "No adverts to display. Please adjust your search filters."
                                : "You have not created any adverts yet. Get started by creating your first advert"
                        }
                    />
                )}
                {listings.items?.map((item) => (
                    <DashboardListingItem key={item.id} listingItem={item} basePath="/dashboard/my-listings" isAdmin={session?.user?.isAdmin} />
                ))}
                {listings.totalPages > 1 && (
                    <Pagination
                        pageNumber={listings.pageNumber}
                        totalPages={listings.totalPages}
                        basePath="/dashboard/my-listings"
                        searchParams={searchParams}
                    />
                )}
            </div>
        </>
    );
};

export default MyAds;
