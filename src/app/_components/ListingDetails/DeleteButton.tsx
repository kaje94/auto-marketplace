"use client";
import { TrashIcon } from "@/icons";
import { ListingItem } from "@/utils/types";
import clsx from "clsx";
import { FC, useState } from "react";
import { DeleteListingItemModal } from "../Modals/DeleteListingItemModal";

interface Props {
    listingItem: ListingItem;
    isOwner: boolean;
    loading?: boolean;
}

export const DeleteButton: FC<Props> = ({ listingItem, isOwner, loading }) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    return (
        <>
            <button
                className={clsx("btn-error btn-block btn gap-2", loading && "animate-pulse")}
                onClick={() => setDeleteModalVisible(true)}
                disabled={loading}
            >
                <TrashIcon />
                Delete
            </button>
            <DeleteListingItemModal
                visible={deleteModalVisible}
                setVisible={setDeleteModalVisible}
                listingItem={listingItem}
                successRedirectPath={isOwner ? "/dashboard/my-listings" : "/dashboard/listings"}
            />
        </>
    );
};
