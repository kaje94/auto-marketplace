"use client";
import { clsx } from "clsx";
import { FC, useState } from "react";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { RenewListingItemModal } from "@/components/Modals/RenewListingItemModal";

interface Props {
    listingItem: ListingItem;
    loading?: boolean;
}

export const RenewButton: FC<Props> = ({ listingItem, loading }) => {
    const [renewModalVisible, setRenewModalVisible] = useState(false);

    return (
        <>
            <button
                className={clsx("btn btn-ghost btn-sm", loading && "animate-pulse")}
                disabled={loading}
                onClick={() => setRenewModalVisible(true)}
            >
                Renew
            </button>
            <RenewListingItemModal listingItem={listingItem} visible={renewModalVisible} onVisibleChange={setRenewModalVisible} />
        </>
    );
};
