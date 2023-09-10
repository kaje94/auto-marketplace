"use client";
import { EyeOffIcon } from "@/icons";
import { ListingItem } from "@/utils/types";
import clsx from "clsx";
import { FC, useState } from "react";
import { UnListListingModal } from "../Modals/UnListListingModal";

interface Props {
    listingItem: ListingItem;
    loading?: boolean;
}

export const UnListButton: FC<Props> = ({ listingItem, loading }) => {
    const [unListModalVisible, setUnListModalVisible] = useState(false);

    return (
        <>
            <button
                className={clsx("btn-block btn gap-2", loading && "animate-pulse")}
                onClick={() => setUnListModalVisible(true)}
                disabled={loading}
            >
                <EyeOffIcon />
                Unlist
            </button>
            <UnListListingModal visible={unListModalVisible} setVisible={setUnListModalVisible} listingItem={listingItem} />
        </>
    );
};
