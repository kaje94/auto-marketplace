"use client";
import { useState } from "react";
import { RenewListingItemModal } from "@/components/Modals/RenewListingItemModal";
import { useScopedI18n } from "@/locales/client";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
}

export const RenewButton = ({ listingItem }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const tCommon = useScopedI18n("common");

    return (
        <>
            <button className="btn btn-ghost btn-sm" onClick={() => setModalVisible(true)}>
                {tCommon("renew")}
            </button>
            <RenewListingItemModal listingItem={listingItem} setVisible={setModalVisible} visible={modalVisible} />
        </>
    );
};
