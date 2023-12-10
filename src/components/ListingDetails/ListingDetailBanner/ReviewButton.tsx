"use client";
import { useState } from "react";
import { ReviewListingModal } from "@/components/Modals/ReviewListingModal";
import { useScopedI18n } from "@/locales/client";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
}

export const ReviewButton = ({ listingItem }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const tCommon = useScopedI18n("common");

    return (
        <>
            <button className="btn btn-ghost btn-sm" onClick={() => setModalVisible(true)}>
                {tCommon("review")}
            </button>
            <ReviewListingModal listingItem={listingItem} setVisible={setModalVisible} visible={modalVisible} />
        </>
    );
};
