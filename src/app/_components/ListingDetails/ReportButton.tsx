"use client";
import { InfoIcon } from "@/icons";
import clsx from "clsx";
import { FC, useState } from "react";
import { ReportListingModal } from "@/app/_components/Modals/ReportListingModal";
import { ListingIdType } from "@/utils/types";

interface Props {
    loading?: boolean;
    listingId?: ListingIdType;
    listingTitle?: string;
}

export const ReportButton: FC<Props> = ({ loading, listingId, listingTitle }) => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <button
                tabIndex={0}
                className={clsx("!btn-ghost btn-error btn-block btn gap-2", loading && "animate-pulse")}
                disabled={loading}
                onClick={() => setModalVisible(true)}
            >
                <InfoIcon />
                Report
            </button>
            {!loading && <ReportListingModal listingId={listingId} listingTitle={listingTitle} setVisible={setModalVisible} visible={modalVisible} />}
        </>
    );
};
