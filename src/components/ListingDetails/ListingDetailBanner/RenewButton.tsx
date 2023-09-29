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
            <button className="btn-ghost btn-sm btn" onClick={() => setModalVisible(true)}>
                Renew
            </button>
            <RenewListingItemModal setVisible={setModalVisible} visible={modalVisible} listingItem={listingItem} />
        </>
    );
};
