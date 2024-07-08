import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { FC } from "react";
import { ListingItem, ListingItem_Data } from "targabay-protos/gen/ts/dist/types/common_pb";
import { LinkWithLocale, ListingImage } from "@/components/Common";
import { ContextMenuLoading } from "@/components/Common/ContextMenu";
import { COUNTRIES } from "@/utils/countries";
import { ListingStatusTypes } from "@/utils/enum";
import {
    formatHumanFriendlyDate,
    getFormattedCurrency,
    getListingTitleFromListing,
    getLocationString,
    getLocationUserProfile,
    getRandomItem,
    timeAgo,
    unCamelCase,
} from "@/utils/helpers";

/** Lazily loaded context menu */
const DashboardListingItemMenu = dynamic(() => import("./DashboardListingItemMenu").then((mod) => mod.DashboardListingItemMenu), {
    loading: () => <ContextMenuLoading />,
    ssr: false,
});

interface Props {
    /** Base path to be used when forwarding to a subpath */
    basePath?: string;
    /** To enable admin functions */
    isAdmin?: boolean;
    /** Details of a particular listing item */
    listingItem?: ListingItem;
    /** Whether or not to show the placeholder data */
    loading?: boolean;
}

/** To represent an individual listing item within the listing list */
export const DashboardListingItem: FC<Props> = (props) => {
    const { basePath, listingItem = {}, loading, isAdmin } = props;
    const { status, id, expiryDate, data = {}, user, createdAt } = listingItem as ListingItem;
    const { price, description, vehicleImages } = data as ListingItem_Data;
    const listingTitle = getListingTitleFromListing(data as ListingItem_Data);
    const location = getLocationUserProfile(user!);
    const country = COUNTRIES[location?.country ?? ""];
    const locationStr = getLocationString(location, country?.[0]);
    const priceStr = getFormattedCurrency(price, country?.[1]!);

    const listingItemContent = (
        <div className="grid grid-cols-12 gap-0.5 p-3 md:gap-2 md:p-4 xl:gap-4" data-testid="dashboard-listing-item">
            {loading ? (
                <div className="relative hidden aspect-video h-full w-full overflow-hidden rounded-xl bg-base-200 md:col-span-5 md:block xl:col-span-3" />
            ) : (
                <figure className="relative h-fit overflow-hidden rounded-xl md:col-span-5 md:block xl:col-span-3">
                    <ListingImage
                        className="hidden aspect-video h-full w-full bg-base-200 object-cover transition-transform duration-300 ease-linear zoomable-image md:block"
                        height={300}
                        image={vehicleImages?.[0]}
                        location={location}
                        title={listingTitle}
                        width={450}
                    />

                    <div className="absolute bottom-0 left-0 flex h-2/6 w-full flex-col items-center justify-center bg-gradient-to-t from-base-content to-transparent p-5 ">
                        <div className="badge badge-secondary badge-lg absolute scale-110 duration-300 badge-hover-translucent">{priceStr}</div>
                    </div>
                </figure>
            )}

            <div className="col-span-12 flex flex-col gap-0.5 md:col-span-7 xl:col-span-9">
                {loading ? (
                    <div className={clsx("h-6 bg-base-200", getRandomItem(["w-52", "w-60", "w-72"]))} />
                ) : (
                    <div className="flex gap-2">
                        <div className="flex flex-1 flex-wrap items-center gap-0.5 md:gap-2 xl:gap-4">
                            <span className="text-xl font-semibold text-base-content">{listingTitle}</span>
                            <span
                                className={clsx({
                                    "badge badge-lg": true,
                                    "badge-error": status === ListingStatusTypes.Declined,
                                    "badge-info": status === ListingStatusTypes.Posted,
                                    "badge-warning": [ListingStatusTypes.UnderReview, ListingStatusTypes.Expired].includes(
                                        status as ListingStatusTypes,
                                    ),
                                    "badge-success": status === ListingStatusTypes.Sold,
                                })}
                            >
                                {unCamelCase(status)}
                            </span>
                        </div>
                        <DashboardListingItemMenu key={id} basePath={basePath} isAdmin={isAdmin} listingItem={listingItem as ListingItem} />
                    </div>
                )}

                {!loading && status === ListingStatusTypes.Posted && (
                    <span className="text-sm font-light">Expires on {formatHumanFriendlyDate(new Date(expiryDate))}</span>
                )}

                {loading ? (
                    <div className="block h-5 w-44 bg-base-200 md:hidden" />
                ) : (
                    <div className="block text-base md:hidden">
                        Price: <span className="font-medium">{priceStr}</span>
                    </div>
                )}

                {loading ? (
                    <div className={clsx("h-6 bg-base-200", getRandomItem(["w-52", "w-60", "w-72"]))} />
                ) : (
                    <div className="text-base">
                        Location: <span className="font-medium">{locationStr}</span>
                    </div>
                )}

                <div className="flex-1">
                    {loading ? (
                        <div className={clsx("w-full bg-base-200", getRandomItem(["h-10", "h-12", "h-14"]))} />
                    ) : (
                        <p className="line-clamp-2 overflow-hidden text-sm opacity-80 md:line-clamp-3">{description}</p>
                    )}
                </div>

                <div className="mt-2">
                    {loading ? (
                        <div className="h-4 w-32 bg-base-200" />
                    ) : (
                        <div className="text-xs text-neutral-400">Created {timeAgo(new Date(createdAt))}</div>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <div className="card mb-3 h-fit overflow-x-hidden bg-base-100 shadow">{listingItemContent}</div>;
    }

    return (
        <LinkWithLocale
            className="card mb-3 h-fit cursor-pointer bg-base-100 shadow transition-shadow zoom-inner-image hover:shadow-md"
            href={`${basePath}/${id}`}
        >
            {listingItemContent}
        </LinkWithLocale>
    );
};
