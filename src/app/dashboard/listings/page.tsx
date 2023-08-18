import { BreadCrumbs, Empty, Pagination } from "@/app/_components";
import { ListingRowItem } from "./_components";
import { api } from "@/utils/api";
import { getFormattedCurrency, getListingTags, sortVehicleImages, thumbHashToDataUrl } from "@/utils/helpers";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";

const MyAds = async ({ searchParams }: SearchParams) => {
    const page = searchParams["page"] ?? "1";
    let listings = await api.getListings({ PageNumber: Number(page) });
    listings = {
        ...listings,
        items: listings.items.map((item) => ({
            ...item,
            vehicle: {
                ...item.vehicle,
                vehicleImages: sortVehicleImages(
                    item.vehicle.vehicleImages.map((imageItem) => ({ ...imageItem, blurDataURL: thumbHashToDataUrl(imageItem.color) }))
                ),
            },
        })),
    };

    if (listings.totalCount > 0 && listings.items?.length === 0 && page !== "1") {
        const lastPageNumber = Math.ceil(listings.totalCount / 10);
        redirect(`/dashboard/listings?page=${lastPageNumber}`);
    }

    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="My Adverts" />

            <div className="grid gap-1 xl:gap-2">
                {listings.items.length === 0 && (
                    <Empty text="You have not created any adverts yet. Get started by creating your first advert" buttonText="Create new Advert" />
                )}
                {listings.items?.map((item) => (
                    <ListingRowItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        price={getFormattedCurrency(item.price.amount, item.price.currency)}
                        description={item.description}
                        imageUrl={item.vehicle.vehicleImages[0]?.url}
                        blurDataURL={item.vehicle.vehicleImages[0]?.blurDataURL}
                        tags={getListingTags(item.location, item.vehicle)}
                        status={item.status}
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
