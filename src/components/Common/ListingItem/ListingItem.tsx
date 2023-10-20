import { clsx } from "clsx";
import Link from "next/link";
import { FC } from "react";
import { ListingImage } from "@/components/Common";
import { getFormattedCurrency, getLocationString, getRandomItem, numberWithCommas, timeAgo, unCamelCase } from "@/utils/helpers";
import { ListingItem as ListingItemType } from "@/utils/types";

interface Props {
    detailed?: boolean;
    item?: ListingItemType;
    loading?: boolean;
    tinted?: boolean;
}

export const ListingItem: FC<Props> = ({ item, detailed = false, loading, tinted }) => {
    const vehicleImages = item?.vehicle?.vehicleImages || [];
    const image = vehicleImages[0];

    const ListingItemContent = (
        <>
            <figure className="relative">
                {item ? (
                    <ListingImage
                        className={clsx(
                            "zoomable-image aspect-video w-full bg-base-300 object-cover transition-transform duration-300 ease-linear",
                            loading && "opacity-50",
                        )}
                        height={300}
                        image={image}
                        location={item.location}
                        title={item.title}
                        width={450}
                    />
                ) : (
                    <div className="aspect-video w-full bg-neutral bg-opacity-50" />
                )}

                {tinted && <div className="image-hover-tint absolute h-full w-full bg-hero bg-opacity-20 duration-300" />}

                <div className="absolute bottom-0 left-0 mt-5 flex min-h-fit w-full flex-col justify-end bg-gradient-to-t from-neutral to-transparent  px-3 py-0 pt-6">
                    {item ? (
                        <div className="badge-hover-translucent badge badge-secondary badge-lg font-bold duration-300 image-text-shadow ">
                            {getFormattedCurrency(item?.price?.amount, item?.price?.currency)}
                        </div>
                    ) : (
                        <div className="badge badge-accent badge-lg w-32 opacity-50" />
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
            <div className={clsx("card-body flex flex-col gap-0  bg-gradient-to-t from-black to-neutral px-3 pb-2 pt-0")}>
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
                className={clsx(
                    "card h-fit w-full cursor-pointer overflow-hidden bg-neutral shadow transition-shadow duration-300 zoom-inner-image hover:shadow-lg",
                    tinted && "opacity-95",
                )}
                href={`/search/${item?.id}`}
            >
                {ListingItemContent}
            </Link>
        );
    }

    return <div className="card h-fit w-full overflow-hidden bg-base-200 shadow">{ListingItemContent}</div>;
};
