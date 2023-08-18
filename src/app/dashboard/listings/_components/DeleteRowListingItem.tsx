"use client";
import { deleteListingAction } from "@/app/_actions/deleteListingAction";
import { Modal, ModalFooter } from "@/app/_components";
import { TrashIcon } from "@/icons";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
    loading?: boolean;
    listingId?: number;
}

export const DeleteRowListingItem = ({ loading, listingId }: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const toastId = useRef<string>();

    const { mutate, isLoading } = useMutation((id: number) => deleteListingAction(id), {
        onMutate: () => {
            setModalVisible(false);
            toastId.current = toast.loading("Deleting Advert...");
        },
        onSettled: (_data, err) => {
            if (err) {
                toast.error(`Failed to delete advert. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success("Successfully deleted the Advert", { id: toastId?.current });
            }
        },
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
            <Modal visible={modalVisible} onVisibleChange={setModalVisible} title="Delete Advert" titleClassNames="text-error">
                <div>Are you sure you want to delete this advert? This action is not reversible.</div>
                <ModalFooter
                    onVisibleChange={setModalVisible}
                    primaryButton={{ text: "Delete", classNames: "btn-error" }}
                    onSubmit={listingId ? () => mutate(listingId) : undefined}
                />
            </Modal>
        </>
    );
};
