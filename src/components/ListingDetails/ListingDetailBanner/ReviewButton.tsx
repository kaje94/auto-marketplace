"use client";
import { useState } from "react";
import { ReviewListingModal } from "@/components/Modals/ReviewListingModal";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
}

export const ReviewButton = ({ listingItem }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <button className="btn-ghost btn-sm btn" onClick={() => setModalVisible(true)}>
                Review
            </button>
            <ReviewListingModal setVisible={setModalVisible} visible={modalVisible} listingItem={listingItem} />
        </>
    );
};
