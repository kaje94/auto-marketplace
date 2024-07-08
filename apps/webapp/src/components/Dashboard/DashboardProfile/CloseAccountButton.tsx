"use client";
import { useState } from "react";
import { CloseAccountModal } from "@/components/Modals/CloseAccountModal";
import { TrashIcon } from "@/icons";

export const CloseAccountButton = ({ userId }: { userId: string }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <button className="btn btn-error btn-outline" onClick={() => setModalVisible(true)}>
                <TrashIcon />
                Close Account
            </button>
            <CloseAccountModal userId={userId} visible={modalVisible} onVisibleChange={setModalVisible} />
        </>
    );
};
