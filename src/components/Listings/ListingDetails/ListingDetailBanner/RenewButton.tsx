"use client";
import { useState } from "react";
import { RenewListingItemModal } from "@/components/Modals/RenewListingItemModal";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
}

export const RenewButton = ({ listingItem }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <button className="btn btn-ghost btn-sm" onClick={() => setModalVisible(true)}>
                Renew
            </button>
            <RenewListingItemModal listingItem={listingItem} visible={modalVisible} onVisibleChange={setModalVisible} />
        </>
    );
};
