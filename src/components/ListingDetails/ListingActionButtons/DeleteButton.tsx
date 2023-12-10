"use client";
import { clsx } from "clsx";
import { FC, useState } from "react";
import { DeleteListingItemModal } from "@/components/Modals/DeleteListingItemModal";
import { TrashIcon } from "@/icons";
import { useScopedI18n } from "@/locales/client";
import { ListingItem } from "@/utils/types";

interface Props {
    isOwner: boolean;
    listingItem: ListingItem;
    loading?: boolean;
}

export const DeleteButton: FC<Props> = ({ listingItem, isOwner, loading }) => {
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const tCommon = useScopedI18n("common");

    return (
        <>
            <button
                className={clsx("btn btn-block gap-2", loading && "animate-pulse")}
                disabled={loading}
                onClick={() => setDeleteModalVisible(true)}
            >
                <TrashIcon />
                {tCommon("delete")}
            </button>
            <DeleteListingItemModal
                listingItem={listingItem}
                setVisible={setDeleteModalVisible}
                successRedirectPath={isOwner ? "/dashboard/my-listings" : "/dashboard/listings"}
                visible={deleteModalVisible}
            />
        </>
    );
};
