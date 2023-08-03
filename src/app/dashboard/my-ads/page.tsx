import { Pagination } from "@/app/_components";
import { MyAdItem } from "./_components";
import { api } from "@/utils/api";
import { getFormattedCurrency, getListingTags, sortVehicleImages, thumbHashToDataUrl } from "@/utils/helpers";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";

const MyAds = async ({ searchParams }: SearchParams) => {
    const page = searchParams["page"] ?? "1";
    let myAds = await api.getMyListings({ PageNumber: Number(page) });
    myAds = {
        ...myAds,
        items: myAds.items.map((item) => ({
            ...item,
            vehicle: {
                ...item.vehicle,
                vehicleImages: sortVehicleImages(
                    item.vehicle.vehicleImages.map((imageItem) => ({ ...imageItem, blurDataURL: thumbHashToDataUrl(imageItem.color) }))
                ),
            },
        })),
    };

    if (myAds.totalCount > 0 && myAds.items?.length === 0 && page !== "1") {
        const lastPageNumber = Math.ceil(myAds.totalCount / 10);
        redirect(`/dashboard/my-ads?page=${lastPageNumber}`);
    }

    return (
        <div className="grid gap-1 xl:gap-2">
            {myAds.items?.map((item) => (
                <MyAdItem
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
            <Pagination pageNumber={myAds.pageNumber} totalPages={myAds.totalPages} basePath="/dashboard/my-ads" />
        </div>
    );
};

export default MyAds;
