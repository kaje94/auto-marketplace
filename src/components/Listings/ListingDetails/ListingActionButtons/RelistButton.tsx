"use client";
import { clsx } from "clsx";
import { FC, useState } from "react";
import { RelistListingItemModal } from "@/components/Modals/RelistListingItemModal";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem: ListingItem;
    loading?: boolean;
}

export const RelistButton: FC<Props> = ({ listingItem, loading }) => {
    const [relistModalVisible, setRelistModalVisible] = useState(false);

    return (
        <>
            <button
                className={clsx("btn btn-ghost btn-sm", loading && "animate-pulse")}
                disabled={loading}
                onClick={() => setRelistModalVisible(true)}
            >
                Relist
            </button>
            <RelistListingItemModal listingItem={listingItem} visible={relistModalVisible} onVisibleChange={setRelistModalVisible} />
        </>
    );
};
