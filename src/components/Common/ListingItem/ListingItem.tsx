import { clsx } from "clsx";
import Link from "next/link";
import { FC } from "react";
import { ListingImage } from "@/components/Common";
import { getFormattedCurrency, getLocationString, getRandomItem, numberWithCommas, timeAgo, unCamelCase } from "@/utils/helpers";
import { ListingItem as ListingItemType } from "@/utils/types";

interface Props {
    item?: ListingItemType;
    detailed?: boolean;
    loading?: boolean;
}

export const ListingItem: FC<Props> = ({ item, detailed = false, loading }) => {
    const vehicleImages = item?.vehicle?.vehicleImages || [];
    const image = vehicleImages[0];

    const ListingItemContent = (
        <>
            <figure className="relative">
                {item ? (
                    <ListingImage
                        image={image}
                        title={item.title}
                        className={clsx(
                            "zoomable-image aspect-video w-full bg-base-300 object-cover transition-transform duration-300 ease-linear",
                            loading && "opacity-50",
                        )}
                        height={300}
                        width={450}
                        location={item.location}
                    />
                ) : (
                    <div className="aspect-video w-full bg-neutral bg-opacity-50" />
                )}

                <div className="absolute bottom-0 left-0 flex h-2/3 w-full flex-col justify-end bg-gradient-to-t from-base-content to-transparent px-3 py-0">
                    {item ? (
                        <div className="badge-hover-translucent badge badge-primary badge-lg font-bold duration-300 image-text-shadow ">
                            {getFormattedCurrency(item?.price?.amount, item?.price?.currency)}
                        </div>
                    ) : (
                        <div className="badge badge-primary badge-lg w-32 opacity-50" />
                    )}

                    {item ? (
                        <div
                            className={clsx(
                                "badge-hover-translucent line-clamp-3 font-bold text-base-100 duration-300 image-text-shadow",
                                detailed ? "text-2xl" : "text-xl",
                            )}
                        >
                            {item?.title}
                        </div>
                    ) : (
                        <div className={clsx("my-2 h-8 bg-white opacity-50", getRandomItem(["w-4/5", "w-5/6", "w-9/12"]))} />
                    )}
                </div>
            </figure>
            <div className="card-body flex flex-col gap-0  bg-gradient-to-t from-black to-base-content px-3 pb-2 pt-0">
                {item ? (
                    <div className="text-sm font-medium text-base-200">{getLocationString(item?.location)}</div>
                ) : (
                    <div className={clsx("mt-2 h-3 bg-base-200 opacity-50", getRandomItem(["w-1/2", "w-4/6", "w-5/12"]))} />
                )}
                <div className="flex items-end justify-between text-base-300">
                    {item ? (
                        <div className="line-clamp-1 flex-1 text-sm font-light">
                            {`${unCamelCase(item?.vehicle?.condition)} ${
                                item?.vehicle?.millage ? `| ${numberWithCommas(item?.vehicle?.millage)} km ` : ""
                            }| ${unCamelCase(item?.vehicle?.type)}`}
                        </div>
                    ) : (
                        <div className={clsx("mt-1 h-3 bg-base-200 opacity-50", getRandomItem(["w-3/5", "w-8/12", "w-4/6"]))} />
                    )}
                    {detailed && item?.createdOn && <div className="text-xs font-extralight">{timeAgo(new Date(item?.createdOn))}</div>}
                </div>
            </div>
        </>
    );

    if (item) {
        return (
            <Link
                href={`/search/${item?.id}`}
                className="card h-fit w-full cursor-pointer overflow-hidden bg-base-100 shadow transition-shadow duration-300 zoom-inner-image hover:shadow-lg"
            >
                {ListingItemContent}
            </Link>
        );
    }

    return <div className="card h-fit w-full overflow-hidden bg-base-200 shadow">{ListingItemContent}</div>;
};
