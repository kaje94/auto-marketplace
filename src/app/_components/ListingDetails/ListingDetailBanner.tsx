import { AlertCircleIcon } from "@/icons";
import { ListingStatusDescriptions } from "@/utils/constants";
import { ListingStatusTypes } from "@/utils/enum";
import { unCamelCase } from "@/utils/helpers";
import clsx from "clsx";
import { Session } from "next-auth";
import { FC } from "react";
import { ReviewButton } from "./ReviewButton";

export const ListingDetailBanner: FC<{ loading: true } | { listingStatus: ListingStatusTypes; session: Session | null; listingId: number }> = (
    props
) => {
    const isLoading = "loading" in props;
    return (
        <div className={clsx({ "alert mb-6 shadow-lg  mt-4 md:mt-1": true, "animate-pulse": isLoading })}>
            <AlertCircleIcon />
            <div>
                <h3 className={clsx({ "font-bold": true, "opacity-50": isLoading })}>
                    {isLoading ? "Loading..." : unCamelCase(props.listingStatus)}
                </h3>
                <div className={clsx({ "text-xs": true, "opacity-50": isLoading })}>
                    {isLoading ? "Loading description of the listing status..." : ListingStatusDescriptions[props.listingStatus]}
                </div>
            </div>
            {"session" in props && props.session && props.session.user?.isAdmin && props.listingStatus === ListingStatusTypes.UnderReview && (
                <ReviewButton listingId={props.listingId} />
            )}
        </div>
    );
};
