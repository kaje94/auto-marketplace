import { BreadCrumbs, Empty, Pagination, DashboardListHeader, DashboardListingItem } from "@/app/_components";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
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
    let listings = await api.getMyListings(session?.user?.id!, { PageNumber: Number(page), ...parsedSearchParams });
    listings = { ...listings, items: listings.items.map((item) => transformListingResponse(item)) };
    const hasSearchParams = Object.keys(MyListingsFilterSchema.parse(parsedSearchParams)).length > 0;

    if (listings.totalCount > 0 && listings.items?.length === 0 && page !== "1") {
        const lastPageNumber = Math.ceil(listings.totalCount / 10);
        // todo: check if this works fine
        redirect(`/dashboard/my-listings?${qs.stringify({ ...parsedSearchParams, PageNumber: lastPageNumber }, { skipEmptyString: true })}`);
    }

    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="My Adverts" />

            <DashboardListHeader itemCount={listings.totalCount} filter={<DashboardMyListFilter />} />

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
                    <DashboardListingItem
                        key={item.id}
                        listingItem={item}
                        basePath="/dashboard/my-listings"
                        isAdmin={session?.user?.isAdmin}
                        // need created at field as well
                    />
                ))}
                {listings.totalPages > 1 && (
                    <Pagination pageNumber={listings.pageNumber} totalPages={listings.totalPages} basePath="/dashboard/my-listings" />
                )}
            </div>
        </>
    );
};

export default MyAds;
