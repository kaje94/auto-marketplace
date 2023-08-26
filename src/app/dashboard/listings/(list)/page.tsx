import { BreadCrumbs, Empty, Pagination, DashboardListHeader, DashboardListingItem } from "@/app/_components";
import { api } from "@/utils/api";
import { getFormattedCurrency, getLocationString, transformListingResponse } from "@/utils/helpers";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";

const MyAds = async ({ searchParams }: SearchParams) => {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardListingFilterSchema.parse(searchParams);
    let listings = await api.getListings({ PageNumber: Number(page), ...parsedSearchParams });
    listings = { ...listings, items: listings.items.map((item) => transformListingResponse(item)) };
    const hasSearchParams = Object.keys(DashboardListingFilterSchema.parse(parsedSearchParams)).length > 0;

    if (listings.totalCount > 0 && listings.items?.length === 0 && page !== "1") {
        const lastPageNumber = Math.ceil(listings.totalCount / 10);
        // todo: check if this works fine
        redirect(`/dashboard/listings?${qs.stringify({ ...parsedSearchParams, PageNumber: lastPageNumber }, { skipEmptyString: true })}`);
    }

    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="All Adverts" />

            <DashboardListHeader itemCount={listings.totalCount} />

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
                        id={item.id}
                        title={item.title}
                        price={getFormattedCurrency(item.price.amount, item.price.currency)}
                        description={item.description}
                        imageUrl={item.vehicle.vehicleImages[0]?.url}
                        blurDataURL={item.vehicle.vehicleImages[0]?.blurDataURL}
                        location={getLocationString(item.location)}
                        status={item.status}
                        basePath="/dashboard/listings"
                        // need created at field as well
                    />
                ))}
                {listings.totalPages > 1 && (
                    <Pagination pageNumber={listings.pageNumber} totalPages={listings.totalPages} basePath="/dashboard/listings" />
                )}
            </div>
        </>
    );
};

export default MyAds;
