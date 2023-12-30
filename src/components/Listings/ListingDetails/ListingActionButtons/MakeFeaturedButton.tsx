"use client";
import { clsx } from "clsx";
import { FC, useState } from "react";
import { FeatureListingItemModal } from "@/components/Modals/FeatureListingItemModal";
import { StarIcon } from "@/icons";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem: ListingItem;
    loading?: boolean;
}

export const MakeFeaturedButton: FC<Props> = ({ listingItem, loading }) => {
    const [makeFeaturedModalVisible, setMakeFeaturedModalVisible] = useState(false);

    return (
        <>
            <button
                className={clsx("btn btn-secondary btn-block gap-2", loading && "animate-pulse")}
                disabled={loading || listingItem?.featured?.isFeatured}
                onClick={() => setMakeFeaturedModalVisible(true)}
            >
                <StarIcon />
                Feature
            </button>
            <FeatureListingItemModal listingItem={listingItem} visible={makeFeaturedModalVisible} onVisibleChange={setMakeFeaturedModalVisible} />
        </>
    );
};
