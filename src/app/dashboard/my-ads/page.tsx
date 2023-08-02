import { Pagination } from "@/app/_components";
import { MyAdItem } from "./_components";
import { api } from "@/utils/api";
import { getListingTags } from "@/utils/helpers";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";

const MyAds = async ({ searchParams }: SearchParams) => {
    const page = searchParams["page"] ?? "1";
    const myAds = await api.getMyListings({ PageNumber: Number(page) });

    if (myAds.totalCount > 0 && myAds.items?.length === 0 && page !== "1") {
        const lastPageNumber = Math.ceil(myAds.totalCount / 10);
        redirect(`/dashboard/my-ads?page=${lastPageNumber}`);
    }

    return (
        <div className="grid gap-1 xl:gap-2">
            {myAds.items?.map((item) => {
                const thumbnailImage = item.vehicle.vehicleImages?.find((image) => image.isThumbnail);
                return (
                    <MyAdItem
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        price={`${item.price?.currency} ${item.price?.amount}`}
                        description={item.description}
                        imageUrl={thumbnailImage?.url}
                        imageHash={thumbnailImage?.color}
                        tags={getListingTags(item.location, item.vehicle)}
                        status={item.status}
                        // need created at field as well
                    />
                );
            })}
            <Pagination pageNumber={myAds.pageNumber} totalPages={myAds.totalPages} basePath="/dashboard/my-ads" />
        </div>
    );
};

export default MyAds;
