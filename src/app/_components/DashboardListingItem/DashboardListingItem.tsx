import { FC } from "react";
import Image from "next/image";
import clsx from "clsx";
import Link from "next/link";
import { getRandomItem, unCamelCase } from "@/utils/helpers";
import { ListingStatusTypes } from "@/utils/enum";
import { DashboardListingItemMenu } from "./DashboardListingItemMenu";

interface Props {
    basePath?: string;
    id?: number;
    title?: string;
    imageUrl?: string;
    blurDataURL?: string;
    price?: string;
    location?: string;
    description?: string;
    loading?: boolean;
    status?: ListingStatusTypes;
}

export const DashboardListingItem: FC<Props> = (props) => {
    const { basePath, title, price, description, location, status = ListingStatusTypes.Posted, id, imageUrl, blurDataURL, loading } = props;
    const myAddItemContent = (
        <>
            {loading ? (
                <div className="relative hidden aspect-video h-full w-full overflow-hidden rounded-xl bg-base-200 md:col-span-5 md:block xl:col-span-3" />
            ) : (
                <figure className="relative h-full overflow-hidden rounded-xl md:col-span-5 md:block xl:col-span-3">
                    <Image
                        src={imageUrl ?? ""}
                        alt={title ?? ""}
                        className="zoomable-image hidden aspect-video h-full w-full bg-base-200 object-cover transition-transform duration-300 ease-linear md:block"
                        height={300}
                        width={450}
                        placeholder={blurDataURL ? "blur" : "empty"}
                        blurDataURL={blurDataURL}
                    />

                    <div className="absolute bottom-0 left-0 flex h-2/6 w-full flex-col items-center justify-center bg-gradient-to-t from-base-content to-transparent p-5 ">
                        <div className="badge-hover-translucent badge badge-secondary badge-lg absolute scale-110 duration-300">{price}</div>
                    </div>
                </figure>
            )}

            <div className="col-span-12 flex flex-col gap-0.5 md:col-span-7 xl:col-span-9">
                {loading ? (
                    <div className={clsx("h-6 bg-base-200", getRandomItem(["w-52", "w-60", "w-72"]))} />
                ) : (
                    <div className="flex gap-2">
                        <div className="flex flex-1 flex-wrap items-center gap-0.5 md:gap-2 xl:gap-4">
                            <span className="text-xl font-semibold text-base-content">{title}</span>
                            <span
                                className={clsx({
                                    "badge badge-lg": true,
                                    "badge-error": status === ListingStatusTypes.Declined,
                                    "badge-info": status === ListingStatusTypes.Posted,
                                    "badge-warning": [ListingStatusTypes.UnderReview, ListingStatusTypes.Expired].includes(
                                        status as ListingStatusTypes
                                    ),
                                    "badge-success": status === ListingStatusTypes.Sold,
                                })}
                            >
                                {unCamelCase(status)}
                            </span>
                        </div>
                        <DashboardListingItemMenu listingId={id} listingTitle={title} status={status} />
                    </div>
                )}

                {loading ? (
                    <div className="block h-5 w-44 bg-base-200 md:hidden" />
                ) : (
                    <div className="block text-base md:hidden">
                        Price: <span className="font-medium">{price}</span>
                    </div>
                )}

                {loading ? (
                    <div className={clsx("h-6 bg-base-200", getRandomItem(["w-52", "w-60", "w-72"]))} />
                ) : (
                    <div className="text-base">
                        Location: <span className="font-medium">{location}</span>
                    </div>
                )}

                <div className="flex-1">
                    {loading ? (
                        <div className={clsx("w-full bg-base-200", getRandomItem(["h-10", "h-12", "h-14"]))} />
                    ) : (
                        <p className="line-clamp-2 overflow-hidden text-sm opacity-80 md:line-clamp-3">{description}</p>
                    )}
                </div>

                {loading ? <div className="h-5 w-32 bg-base-200" /> : <div className="text-sm italic text-neutral-400">Posted 2 days ago</div>}
            </div>
        </>
    );

    if (loading) {
        return (
            <div className="card mb-3 grid animate-pulse grid-cols-12 gap-0.5 overflow-x-hidden bg-base-100 p-3 shadow md:gap-2 md:p-4 xl:gap-4">
                {myAddItemContent}
            </div>
        );
    }

    return (
        <Link
            className="card mb-3 grid cursor-pointer grid-cols-12 gap-0.5 bg-base-100 p-3 shadow transition-shadow zoom-inner-image hover:shadow-md md:gap-2 md:p-4 xl:gap-4"
            href={`${basePath}/${id}`}
        >
            {myAddItemContent}
        </Link>
    );
};
