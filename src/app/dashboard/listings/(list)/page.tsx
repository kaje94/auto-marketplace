import { BreadCrumbs, Empty, Pagination, DashboardListHeader, DashboardListingItem } from "@/app/_components";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { DashboardAllListFilter } from "@/app/_components/DashboardListHeader/DashboardAllListFilter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";

const AllAds = async ({ searchParams }: SearchParams) => {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardListingFilterSchema.parse(searchParams);
    const session = await getServerSession(authOptions);
    let listings = await api.getListings({ PageNumber: Number(page), ...parsedSearchParams });
    listings = { ...listings, items: listings.items.map((item) => transformListingResponse(item)) };

    if (listings.totalCount > 0 && listings.items?.length === 0 && page !== "1") {
        const lastPageNumber = Math.ceil(listings.totalCount / 10);
        redirect(`/dashboard/listings?${qs.stringify({ ...parsedSearchParams, PageNumber: lastPageNumber }, { skipEmptyString: true })}`);
    }

    return (
        <>
            <DashboardListHeader
                itemCount={listings.totalCount}
                filter={<DashboardAllListFilter />}
                addNewButton={{ label: "New Advert", path: "/dashboard/new-listing" }}
            />

            <div className="grid gap-1 xl:gap-2">
                {listings.totalCount === 0 && <Empty text={"No adverts to display. Please adjust your search filters."} />}
                {listings.items?.map((item) => (
                    <DashboardListingItem key={item.id} listingItem={item} basePath="/dashboard/listings" isAdmin={session?.user?.isAdmin} />
                ))}
                {listings.totalPages > 1 && (
                    <Pagination
                        pageNumber={listings.pageNumber}
                        totalPages={listings.totalPages}
                        basePath="/dashboard/listings"
                        searchParams={searchParams}
                    />
                )}
            </div>
        </>
    );
};

export default AllAds;
