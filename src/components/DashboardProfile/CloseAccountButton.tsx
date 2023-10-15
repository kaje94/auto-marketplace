"use client";
import { useState } from "react";
import { TrashIcon } from "@/icons";
import { CloseAccountModal } from "../Modals/CloseAccountModal";

export const CloseAccountButton = ({ userId }: { userId: string }) => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <button className="btn btn-error btn-outline" onClick={() => setModalVisible(true)}>
                <TrashIcon />
                Close Account
            </button>
            <CloseAccountModal setVisible={setModalVisible} userId={userId} visible={modalVisible} />
        </>
    );
};
