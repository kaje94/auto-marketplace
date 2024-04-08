import { clsx } from "clsx";
import { FC } from "react";
import { ListingItem, ListingItem_Data } from "targabay-protos/gen/ts/dist/types/common_pb";
import { LinkWithLocale } from "@/components/Common";
import { COUNTRIES } from "@/utils/countries";
import { ListingStatusTypes, VehicleTypes } from "@/utils/enum";
import {
    formatHumanFriendlyDate,
    getFormattedCurrency,
    getListingTitleFromListing,
    getLocationString,
    getLocationUserProfile,
    isRenewableListing,
} from "@/utils/helpers";
import { DeleteButton, EditButton, RelistButton, RenewButton, ReportButton, ShareButton, UnListButton } from "./ListingActionButtons";
import { ListingDetailsFeatures } from "./ListingDetailsFeatures";
import { ListingImageCarousel } from "./ListingImageCarousel";
import { ListingKeySpecifications } from "./ListingKeySpecifications";
import { ListingSellerDetails } from "./ListingSellerDetails";

interface Props {
    basePath?: string;
    itemDetails?: ListingItem;
    loading?: boolean;
    loggedInUser?: {
        email?: string | null;
        isAdmin?: boolean;
    };
    showSellerDetails?: boolean;
    withinDashboard?: boolean;
}

export const ListingDetails: FC<Props> = ({
    loggedInUser,
    itemDetails = {},
    loading = false,
    withinDashboard = false,
    showSellerDetails = true,
    basePath,
}) => {
    const { user, status, id, createdAt, data = {} } = itemDetails as ListingItem;
    const { description, price, vehicleImages, type, priceNegotiable, features = [] } = data as ListingItem_Data;
    const title = getListingTitleFromListing(data as ListingItem_Data);
    const location = getLocationUserProfile(user!);
    const country = COUNTRIES[location?.country ?? ""];

    return (
        <div className="grid grid-cols-8 gap-4 xl:gap-7 2xl:gap-8">
            <div className={clsx("col-span-8 flex flex-col gap-4 xl:gap-7 2xl:gap-8", withinDashboard ? "xl:col-span-5" : "lg:col-span-5")}>
                <div className="card  bg-base-100 shadow">
                    <ListingImageCarousel
                        createdOn={createdAt}
                        images={vehicleImages}
                        loading={loading}
                        location={location}
                        title={title}
                        vehicleType={type as VehicleTypes}
                    />
                </div>
                <div className="card stat  bg-base-100 p-3  shadow lg:p-5 xl:p-6">
                    <div className="stat-title">Description</div>
                    <div className="divider" />
                    <p className={clsx({ "mt-2 w-full whitespace-pre-line text-sm font-medium": true, "animate-pulse h-40 bg-base-200": loading })}>
                        {description}
                    </p>
                </div>
            </div>
            <div className={clsx("col-span-8 flex flex-col gap-4 xl:gap-7 2xl:gap-8", withinDashboard ? "xl:col-span-3" : "lg:col-span-3")}>
                <div className={clsx({ "grid gap-4  xl:gap-7 2xl:gap-8": true, "xl:grid-cols-2": !withinDashboard })}>
                    <div className="card stat place-items-center bg-base-100 shadow">
                        <div className="stat-title">Location</div>
                        {loading ? (
                            <>
                                <div className="h-5 w-1/2 animate-pulse bg-base-200" />
                                <div className="mt-1 h-5 w-4/6 animate-pulse bg-base-200" />
                            </>
                        ) : (
                            <div className="mt-2 text-center text-lg font-bold">{getLocationString(location, country?.[0])}</div>
                        )}
                    </div>
                    <div className="card stat place-items-center bg-primary text-primary-content shadow">
                        <div className="stat-title text-primary-content">{country?.[1] ? `Price (${country?.[1]})` : "Price"}</div>
                        {loading ? (
                            <div className="h-9 w-4/6 animate-pulse bg-secondary" />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-1">
                                <div className="w-full !break-words text-center text-2xl font-extrabold">
                                    {getFormattedCurrency(price, country?.[2]!)}
                                </div>
                                {priceNegotiable && <span className="badge badge-secondary">Negotiable</span>}
                            </div>
                        )}
                    </div>
                </div>

                <div className="card stat place-items-center bg-base-100 shadow">
                    <div className="stat-title">Key Specifications</div>
                    <ListingKeySpecifications countryCode={location?.country} loading={loading} vehicle={data as ListingItem_Data} />
                </div>
                <div className="card stat place-items-center bg-base-100 shadow">
                    <div className="stat-title">Features</div>
                    <ListingDetailsFeatures features={features} loading={loading} />
                </div>
                {showSellerDetails && (
                    <div className="card stat place-items-center bg-base-100 shadow">
                        <div className="stat-title">Seller</div>
                        <ListingSellerDetails loading={loading} user={user} />
                    </div>
                )}
                {!withinDashboard && (
                    <div className="card stat place-items-center bg-base-100 shadow">
                        <div className="stat-title">Safety Tips</div>
                        {loading ? (
                            <>
                                <div className="h-16 w-full animate-pulse bg-base-200" />
                                <div className="mt-1 h-7 w-1/3 animate-pulse bg-base-200" />
                            </>
                        ) : (
                            <>
                                <p className="mt-1 text-center text-sm">
                                    Protect yourself online. Never share sensitive information like credit/debit card details and OTPs with third
                                    parties for a secure vehicle marketplace.
                                </p>
                                <LinkWithLocale href="/safety-tips">
                                    <button className="link-neutral btn btn-link btn-sm">View all safety Tips</button>
                                </LinkWithLocale>
                            </>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {!loading && (user?.email === loggedInUser?.email || loggedInUser?.isAdmin) && (
                        <>
                            <div className="alert col-span-full flex items-center justify-between gap-2 rounded-lg text-sm text-opacity-80">
                                <span>{`Advert will expire on ${formatHumanFriendlyDate(new Date((itemDetails as ListingItem)?.expiryDate))}`}</span>
                                {isRenewableListing(new Date((itemDetails as ListingItem)?.expiryDate)) &&
                                    status && [ListingStatusTypes.Posted, ListingStatusTypes.Expired] && (
                                        <RenewButton listingItem={itemDetails as ListingItem} />
                                    )}
                            </div>
                            <EditButton
                                basePath={basePath ? basePath : loggedInUser?.isAdmin ? "/dashboard/listings" : "/dashboard/my-listings"}
                                listingItem={itemDetails as ListingItem}
                            />
                        </>
                    )}
                    {status === ListingStatusTypes.Posted && !withinDashboard && (
                        <>
                            <ShareButton loading={loading} title={title} />
                            {loggedInUser?.email !== user?.email && (
                                <ReportButton listingId={id} listingTitle={title} loading={loading} userEmail={loggedInUser?.email} />
                            )}
                        </>
                    )}
                    {!loading && loggedInUser?.isAdmin && (
                        <DeleteButton isOwner={user?.email === loggedInUser?.email} listingItem={itemDetails as ListingItem} />
                    )}
                    {!loading && (user?.email === loggedInUser?.email || loggedInUser?.isAdmin) && status && (
                        <>
                            {[ListingStatusTypes.Posted, ListingStatusTypes.Expired].includes(status as ListingStatusTypes) && (
                                <UnListButton listingItem={itemDetails as ListingItem} />
                            )}
                            {[ListingStatusTypes.TemporarilyUnlisted].includes(status as ListingStatusTypes) && (
                                <RelistButton listingItem={itemDetails as ListingItem} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
