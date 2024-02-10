"use client";
import { clsx } from "clsx";
import { FC, useState } from "react";
import { ReportListingModal } from "@/components/Modals/ReportListingModal";
import { InfoIcon } from "@/icons";
import { RecaptchaProvider } from "@/providers/RecaptchaProvider";
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
                className={clsx("btn btn-error !btn-ghost btn-block gap-2", loading && "animate-pulse")}
                disabled={loading}
                onClick={() => setModalVisible(true)}
            >
                <InfoIcon />
                Report
            </button>
            {!loading && (
                <RecaptchaProvider>
                    <ReportListingModal
                        listingId={listingId}
                        listingTitle={listingTitle}
                        userEmail={userEmail}
                        visible={modalVisible}
                        onVisibleChange={setModalVisible}
                    />
                </RecaptchaProvider>
            )}
        </>
    );
};
