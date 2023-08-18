import { ListingItem } from "@/app/_components";
import { getFormattedCurrency, getListingTags } from "@/utils/helpers";
import { ListingItem as ListingItemType } from "@/utils/types";
import { FC } from "react";

interface Props {
    relatedListings?: ListingItemType[];
    loading?: boolean;
}

// todo: handle loading UI
export const RelatedListings: FC<Props> = ({ relatedListings = [] }) => {
    return (
        <>
            {relatedListings.length > 0 && (
                <>
                    <div className="divider mt-16">Related Vehicles</div>
                    <div className="mt-10 grid gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-4 2xl:gap-8">
                        {relatedListings?.map((item) => (
                            <ListingItem
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                price={getFormattedCurrency(item.price.amount, item.price.currency)}
                                description={item.description}
                                tags={getListingTags(item.location, item.vehicle)}
                                imageUrl={item.vehicle?.vehicleImages[0]?.url ?? ""}
                                blurDataURL={item.vehicle?.vehicleImages[0]?.blurDataURL}
                                imageAlt={`${item.title} thumbnail`}
                            />
                        ))}
                    </div>
                </>
            )}
        </>
    );
};
