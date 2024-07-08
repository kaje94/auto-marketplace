"use client";
import { clsx } from "clsx";
import { FC, useState } from "react";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { RelistListingItemModal } from "@/components/Modals/RelistListingItemModal";

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
