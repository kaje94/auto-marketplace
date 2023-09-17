import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { ListingItem as ListingItemType, Vehicle } from "@/utils/types";
import { getFormattedCurrency, getLocationString, getRandomItem, numberWithCommas, timeAgo, unCamelCase } from "@/utils/helpers";
import clsx from "clsx";

interface Props {
    item?: ListingItemType;
    detailed?: boolean;
    loading?: boolean;
}

export const ListingItem: FC<Props> = ({ item = {}, detailed = false, loading }) => {
    const { id, title, price, vehicle = {}, createdOn, location } = item as ListingItemType;
    const { vehicleImages = [], millage, condition } = vehicle as Vehicle;
    const image = vehicleImages[0];

    const ListingItemContent = (
        <>
            <figure className="relative">
                {item ? (
                    <Image
                        src={image?.url!}
                        alt={`${title}-thumbnail`}
                        className={clsx(
                            "zoomable-image aspect-video w-full bg-base-200 object-cover transition-transform duration-300 ease-linear",
                            loading && "opacity-50"
                        )}
                        height={300}
                        width={450}
                        placeholder={image?.blurDataURL ? "blur" : "empty"}
                        blurDataURL={image?.blurDataURL}
                    />
                ) : (
                    <div className="aspect-video w-full bg-base-200" />
                )}

                <div
                    className={clsx(
                        "absolute bottom-0 left-0 flex h-2/3 w-full flex-col justify-end px-3 py-0",
                        item && "bg-gradient-to-t from-base-content to-transparent"
                    )}
                >
                    {item ? (
                        <div className="badge-hover-translucent badge badge-primary badge-lg font-bold duration-300 image-text-shadow ">
                            {getFormattedCurrency(price?.amount, price?.currency)}
                        </div>
                    ) : (
                        <div className="badge badge-primary badge-lg w-32 opacity-50" />
                    )}

                    {item ? (
                        <div
                            className={clsx(
                                "badge-hover-translucent font-bold text-base-100 duration-300 image-text-shadow",
                                detailed ? "text-2xl" : "text-xl"
                            )}
                        >
                            {title}
                        </div>
                    ) : (
                        <div className={clsx("rounded-box my-1 h-8 bg-base-300", getRandomItem(["w-4/5", "w-5/6", "w-9/12"]))} />
                    )}
                </div>
            </figure>
            <div
                className={clsx(
                    "card-body flex flex-col gap-0  px-3 pb-2 pt-0",
                    item ? "bg-gradient-to-t from-black to-base-content" : "bg-base-200"
                )}
            >
                {item ? (
                    <div className="text-sm font-medium text-base-200">{getLocationString(location)}</div>
                ) : (
                    <div className={clsx("h-3 rounded bg-base-300", getRandomItem(["w-1/2", "w-4/6", "w-5/12"]))} />
                )}
                <div className="flex items-center justify-between  text-base-300">
                    {item ? (
                        <div className="text-sm font-light">
                            {millage ? `${numberWithCommas(millage)} km (${unCamelCase(condition)})` : unCamelCase(condition)}
                        </div>
                    ) : (
                        <div className={clsx("h-3 rounded bg-base-300", getRandomItem(["w-3/5", "w-8/12", "w-4/6"]))} />
                    )}
                    {detailed && <div className="text-xs font-extralight">{timeAgo(new Date(createdOn))}</div>}
                </div>
            </div>
        </>
    );

    if (item) {
        return (
            <Link
                href={`/search/${id}`}
                className={clsx(
                    "card h-fit w-full cursor-pointer overflow-hidden bg-base-100 shadow transition-shadow duration-300 zoom-inner-image hover:shadow-lg",
                    loading && "animate-pulse"
                )}
            >
                {ListingItemContent}
            </Link>
        );
    }

    return <div className="card h-fit w-full animate-pulse overflow-hidden bg-base-200">{ListingItemContent}</div>;
};
