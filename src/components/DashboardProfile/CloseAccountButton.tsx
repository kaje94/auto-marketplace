"use client";
import { useState } from "react";
import { CloseAccountModal } from "@/components/Modals/CloseAccountModal";
import { TrashIcon } from "@/icons";
import { useScopedI18n } from "@/locales/client";

export const CloseAccountButton = ({ userId }: { userId: string }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const tDashboardProfile = useScopedI18n("components.dashboardProfile");

    return (
        <>
            <button className="btn btn-error btn-outline" onClick={() => setModalVisible(true)}>
                <TrashIcon />
                {tDashboardProfile("closeAccount")}
            </button>
            <CloseAccountModal setVisible={setModalVisible} userId={userId} visible={modalVisible} />
        </>
    );
};
