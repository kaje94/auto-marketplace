"use client";
import { deleteListingAction } from "@/app/_actions/deleteListingAction";
import { Modal } from "@/app/_components";
import { TrashIcon } from "@/icons";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface Props {
    loading?: boolean;
    listingId?: number;
}

export const DeleteMyAdItem = ({ loading, listingId }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { mutate, isLoading } = useMutation((id: number) => deleteListingAction(id), {
        onSuccess: () => setModalVisible(false),
    });
    return (
        <>
            <button
                className="btn-ghost btn-error btn-sm btn text-error md:w-full"
                disabled={loading}
                onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setModalVisible(true);
                }}
            >
                <TrashIcon />
                <span className="ml-2">Delete</span>
            </button>
            <Modal visible={modalVisible} onVisibleChange={setModalVisible}>
                <div className="text-lg font-bold text-error">Delete Advert?</div>
                <div className="mt-2 text-base-content opacity-75">Are you sure you want to delete this advert? This action is not reversible.</div>
                <div className="mt-4 flex justify-end gap-3">
                    <button className="btn-ghost btn" onClick={() => setModalVisible(false)}>
                        Cancel
                    </button>
                    <button className="btn-error btn" onClick={listingId ? () => mutate(listingId) : undefined}>
                        {isLoading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </Modal>
        </>
    );
};
