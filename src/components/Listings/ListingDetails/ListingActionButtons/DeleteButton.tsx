"use client";
import { clsx } from "clsx";
import { FC, useState } from "react";
import { DeleteListingItemModal } from "@/components/Modals/DeleteListingItemModal";
import { TrashIcon } from "@/icons";
import { ListingItem } from "@/utils/types";

interface Props {
    isOwner: boolean;
    listingItem: ListingItem;
    loading?: boolean;
}

export const DeleteButton: FC<Props> = ({ listingItem, isOwner, loading }) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    return (
        <>
            <button
                className={clsx("btn btn-block gap-2", loading && "animate-pulse")}
                disabled={loading}
                onClick={() => setDeleteModalVisible(true)}
            >
                <TrashIcon />
                Delete
            </button>
            <DeleteListingItemModal
                listingItem={listingItem}
                successRedirectPath={isOwner ? "/dashboard/my-listings" : "/dashboard/listings"}
                visible={deleteModalVisible}
                onVisibleChange={setDeleteModalVisible}
            />
        </>
    );
};
