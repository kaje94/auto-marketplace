"use client";
import { useState } from "react";
import { RelistListingItemModal } from "@/components/Modals/RelistListingItemModal";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
}

export const RelistButton = ({ listingItem }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <button className="btn btn-ghost btn-sm" onClick={() => setModalVisible(true)}>
                Relist
            </button>
            <RelistListingItemModal listingItem={listingItem} visible={modalVisible} onVisibleChange={setModalVisible} />
        </>
    );
};
