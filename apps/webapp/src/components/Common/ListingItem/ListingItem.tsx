import { clsx } from "clsx";
import { FC } from "react";
import { ListingItem as ListingItemType } from "targabay-protos/gen/ts/dist/types/common_pb";
import { LinkWithLocale, ListingImage } from "@/components/Common";
import { COUNTRIES } from "@/utils/countries";
import {
    getDistanceUnit,
    getFormattedCurrency,
    getFormattedDistance,
    getListingTitleFromListing,
    getLocationString,
    getLocationUserProfile,
    getRandomItem,
    timeAgo,
    unCamelCase,
} from "@/utils/helpers";

interface Props {
    /** Whether or not to show the created time in the component */
    detailed?: boolean;
    /** Details of the created listing item */
    item?: ListingItemType;
    /** Show a skeleton component while the actual data is loaded */
    loading?: boolean;
    /** A variant of listing item to be used in the landing page listing carousel */
    tinted?: boolean;
}

/** Component to represent a listing item within the posted listing page as well as within listing carousel in listing details and landing page */
export const ListingItem: FC<Props> = ({ item, detailed = false, loading, tinted }) => {
    const vehicleImages = item?.data?.vehicleImages || [];
    const image = vehicleImages[0];
    const location = getLocationUserProfile(item?.user!);
    const country = COUNTRIES[item?.user?.data?.countryCode ?? ""];
    const title = getListingTitleFromListing(item?.data!);

    const ListingItemContent = (
        <>
            <figure className="relative">
                {item ? (
                    <ListingImage
                        className={clsx(
                            "aspect-video w-full bg-base-300 object-cover transition-transform duration-300 ease-linear zoomable-image",
                            loading && "opacity-50",
                        )}
                        height={300}
                        image={image}
                        location={location}
                        showHasError={false}
                        title={title}
                        width={450}
                    />
                ) : (
                    <div className={clsx("aspect-video w-full bg-hero bg-opacity-50", tinted ? "bg-hero" : "bg-base-200")} />
                )}

                {tinted && <div className="absolute h-full w-full bg-hero bg-opacity-20 duration-300 image-hover-tint" />}

                <div
                    className={clsx(
                        "absolute bottom-0 left-0 mt-5 flex min-h-fit w-full flex-col justify-end bg-gradient-to-t to-transparent  px-3 py-0 pt-6",
                        item || tinted ? "from-neutral" : "from-base-200",
                    )}
                >
                    {item ? (
                        <div className="badge badge-secondary badge-lg font-bold duration-300 badge-hover-translucent image-text-shadow ">
                            {getFormattedCurrency(item?.data?.price, country?.[2]!)}
                        </div>
                    ) : (
                        <div className="badge badge-accent badge-lg w-32 opacity-30" />
                    )}

                    {item ? (
                        <div
                            className={clsx(
                                "line-clamp-2 font-bold text-base-100 duration-300 badge-hover-translucent image-text-shadow",
                                detailed ? "text-2xl" : "text-xl",
                            )}
                        >
                            {title}
                        </div>
                    ) : (
                        <div className={clsx("my-2 h-8 bg-base-300 opacity-50", getRandomItem(["w-4/5", "w-5/6", "w-9/12"]))} />
                    )}
                </div>
            </figure>
            <div
                className={clsx(
                    "card-body flex flex-col gap-0 bg-gradient-to-t  px-3 pb-2 pt-0",
                    item || tinted ? "from-black to-neutral" : "from-base-300 to-base-200",
                )}
            >
                {item ? (
                    <div className="truncate text-sm font-medium text-base-200">{getLocationString(location, country?.[0])}</div>
                ) : (
                    <div className={clsx("mt-2 h-3 bg-base-300 opacity-50", getRandomItem(["w-1/2", "w-4/6", "w-5/12"]))} />
                )}
                <div className="flex items-end justify-between text-base-300">
                    {item ? (
                        <div className="flex-1 truncate text-sm font-light">
                            {`${unCamelCase(item?.data?.condition)} ${
                                item?.data?.mileage ? `| ${getFormattedDistance(item?.data?.mileage, getDistanceUnit(location.country))} ` : ""
                            }| ${unCamelCase(item?.data?.type)}`}
                        </div>
                    ) : (
                        <div className={clsx("mt-1 h-3 bg-base-300 opacity-50", getRandomItem(["w-3/5", "w-8/12", "w-4/6"]))} />
                    )}
                    {detailed && item?.createdAt && <div className="text-xs font-extralight">{timeAgo(new Date(item?.createdAt))}</div>}
                </div>
            </div>
        </>
    );

    if (item) {
        return (
            <LinkWithLocale
                className={clsx(
                    "card h-fit w-full cursor-pointer overflow-hidden bg-neutral shadow transition-shadow duration-300 zoom-inner-image hover:shadow-lg",
                    tinted && "opacity-95",
                )}
                href={`/search/${item?.id}`}
            >
                {ListingItemContent}
            </LinkWithLocale>
        );
    }

    return <div className={clsx("card h-fit w-full overflow-hidden  shadow", tinted ? "bg-neutral" : "bg-base-200")}>{ListingItemContent}</div>;
};
