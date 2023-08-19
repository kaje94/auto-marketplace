import { AlertCircleIcon } from "@/icons";
import { ListingStatusDescriptions } from "@/utils/constants";
import { ListingStatusTypes } from "@/utils/enum";
import { unCamelCase } from "@/utils/helpers";
import clsx from "clsx";
import { Session } from "next-auth";
import { FC } from "react";
import { ReviewButton } from "./ReviewButton";
import Link from "next/link";

interface Props {
    loading?: boolean;
    listingStatus?: ListingStatusTypes;
    listingComment?: string;
    session?: Session | null;
    listingId?: number;
    listingName?: string;
}

export const ListingDetailBanner: FC<Props> = ({ loading, listingStatus, session, listingComment, listingId, listingName }) => {
    return (
        <div
            className={clsx({
                "alert mb-6 shadow-lg mt-4 md:mt-1": true,
                "animate-pulse": loading,
                "alert-error": listingStatus === ListingStatusTypes.Declined,
                "alert-info": listingStatus === ListingStatusTypes.Posted,
                "alert-warning": [ListingStatusTypes.UnderReview, ListingStatusTypes.Expired].includes(listingStatus as ListingStatusTypes),
                "alert-success": listingStatus === ListingStatusTypes.Sold,
            })}
        >
            <AlertCircleIcon />
            <div>
                <h3 className={clsx({ "font-bold": true, "opacity-50": loading })}>{loading ? "Loading..." : unCamelCase(listingStatus)}</h3>
                <div className={clsx({ "text-xs": true, "opacity-50": loading })}>
                    {loading
                        ? "Loading description of the listing status..."
                        : `${ListingStatusDescriptions[listingStatus as ListingStatusTypes]} ${listingComment ?? ""}`}
                </div>
            </div>
            {!loading && (
                <>
                    {listingStatus === ListingStatusTypes.Posted && (
                        <Link href={`/search/${listingId}`}>
                            <button className="btn-ghost btn-sm btn">View</button>
                        </Link>
                    )}
                    {session?.user?.isAdmin && listingId && listingStatus === ListingStatusTypes.UnderReview && (
                        <ReviewButton listingId={listingId} listingName={listingName} />
                    )}
                    {listingStatus === ListingStatusTypes.Declined && (
                        <Link href={`/dashboard/listings/${listingId}/edit`}>
                            <button className="btn-ghost btn-sm btn">Edit</button>
                        </Link>
                    )}
                </>
            )}
        </div>
    );
};
