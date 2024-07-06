"use client";
import { useState } from "react";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { RelistListingItemModal } from "@/components/Modals/RelistListingItemModal";

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