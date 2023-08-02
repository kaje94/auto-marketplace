import { getFormattedCurrency } from "@/utils/helpers";
import { ListingItem } from "@/utils/types";
import { FC } from "react";
import { Carousel } from "./Carousel";
import { FeaturesOfListing } from "./FeaturesOfListing";
import { ListingKeySpecifications } from "./ListingKeySpecifications";
import { ListingSellerDetails } from "./ListingSellerDetails";
import { ReportButton } from "./ReportButton";
import { ShareButton } from "./ShareButton";
import clsx from "clsx";

interface Props {
    itemDetails?: ListingItem;
    loading?: boolean;
}

export const ListingDetails: FC<Props> = ({ itemDetails = {}, loading = false }) => {
    const { price, vehicle, location, user, title, description } = itemDetails as ListingItem;

    return (
        <div className="grid grid-cols-8 gap-4 xl:gap-7 2xl:gap-8">
            <div className="col-span-8 flex flex-col gap-4 lg:col-span-5 xl:gap-7 2xl:gap-8">
                <div className="card  bg-base-100 shadow">
                    <Carousel images={vehicle?.vehicleImages} title={title} loading={loading} />
                </div>
                <div className="stat card  bg-base-100 p-3  shadow lg:p-5 xl:p-6">
                    <div className="stat-title">Description</div>
                    <div className="divider" />
                    <p className={clsx({ "mt-2 w-full whitespace-pre-line text-sm font-medium": true, "animate-pulse h-40 bg-base-200": loading })}>
                        {description}
                    </p>
                </div>
            </div>
            <div className="col-span-8 flex flex-col gap-4 lg:col-span-3 xl:gap-7 2xl:gap-8">
                <div className="grid gap-4 xl:grid-cols-2 xl:gap-7 2xl:gap-8">
                    <div className="stat card place-items-center bg-base-100 shadow">
                        <div className="stat-title">Location</div>
                        {loading ? (
                            <>
                                <div className="h-5 w-1/2 animate-pulse bg-base-200" />
                                <div className="mt-1 h-5 w-4/6 animate-pulse bg-base-200" />
                            </>
                        ) : (
                            <div className="mt-2 text-center text-lg font-bold">{`${location?.city}, ${location?.state}, ${location?.country}`}</div>
                        )}
                    </div>
                    <div className="stat card place-items-center bg-primary text-primary-content shadow">
                        <div className="stat-title text-primary-content">Price</div>
                        {loading ? (
                            <div className="h-8 w-4/6 animate-pulse bg-secondary" />
                        ) : (
                            <>
                                {" "}
                                <div className="text-center text-xl font-extrabold">{getFormattedCurrency(price?.amount, price?.currency)}</div>
                                {price?.isPriceNegotiable && <span className="badge badge-secondary">Negotiable</span>}
                            </>
                        )}
                    </div>
                </div>

                <div className="stat card place-items-center bg-base-100 shadow">
                    <div className="stat-title">Key Specifications</div>
                    <ListingKeySpecifications vehicle={vehicle} loading={loading} />
                </div>
                <div className="stat card place-items-center bg-base-100 shadow">
                    <div className="stat-title">Features</div>
                    <FeaturesOfListing vehicle={vehicle} loading={loading} />
                </div>
                <div className="stat card place-items-center bg-base-100 shadow">
                    <div className="stat-title">Seller</div>
                    <ListingSellerDetails user={user} loading={loading} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <ShareButton loading={loading} />
                    <ReportButton loading={loading} />
                </div>
            </div>
        </div>
    );
};
