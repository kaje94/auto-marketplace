"use client";
import { clsx } from "clsx";
import { FC, useState } from "react";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { UnListListingModal } from "@/components/Modals/UnListListingModal";
import { EyeOffIcon } from "@/icons";

interface Props {
    listingItem: ListingItem;
    loading?: boolean;
}

export const UnListButton: FC<Props> = ({ listingItem, loading }) => {
    const [unListModalVisible, setUnListModalVisible] = useState(false);

    return (
        <>
            <button
                className={clsx("btn btn-error btn-block gap-2", loading && "animate-pulse")}
                disabled={loading}
                onClick={() => setUnListModalVisible(true)}
            >
                <EyeOffIcon />
                Unlist
            </button>
            <UnListListingModal listingItem={listingItem} visible={unListModalVisible} onVisibleChange={setUnListModalVisible} />
        </>
    );
};
