"use client";
import { clsx } from "clsx";
import { FC, useState } from "react";
import { ReportListingModal } from "@/components/Modals/ReportListingModal";
import { InfoIcon } from "@/icons";
import { ListingIdType } from "@/utils/types";

interface Props {
    listingId?: ListingIdType;
    listingTitle?: string;
    loading?: boolean;
    userEmail?: string | null;
}

export const ReportButton: FC<Props> = ({ loading, listingId, listingTitle, userEmail }) => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <>
            <button
                className={clsx("!btn-ghost btn-error btn-block btn gap-2", loading && "animate-pulse")}
                disabled={loading}
                onClick={() => setModalVisible(true)}
            >
                <InfoIcon />
                Report
            </button>
            {!loading && (
                <ReportListingModal
                    listingId={listingId}
                    listingTitle={listingTitle}
                    setVisible={setModalVisible}
                    userEmail={userEmail}
                    visible={modalVisible}
                />
            )}
        </>
    );
};
