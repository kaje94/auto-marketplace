import { deleteListingAction } from "@/app/_actions/listingActions";
import { Modal, ModalFooter } from "@/app/_components";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Props {
    listingId?: number;
    listingTitle?: string;
    visible?: boolean;
    setVisible?: (visible: boolean) => void;
}

export const DeleteListingItemModal = ({ listingId, listingTitle, visible, setVisible = () => {} }: Props) => {
    const toastId = useRef<string>();
    const router = useRouter();

    const { mutate, isLoading } = useMutation((id: number) => deleteListingAction(id), {
        onSuccess: (_, id) => {
            if ([`/dashboard/listings/${id}`, `/search/${id}`].includes(window?.location?.pathname)) {
                router.replace(`/dashboard/listings`);
            }
        },
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(`Deleting advert ${listingTitle}...`);
        },
        onSettled: (_data, err) => {
            setVisible(false);
            if (err) {
                toast.error(`Failed to delete advert ${listingTitle}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully deleted the Advert ${listingTitle}`, { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal visible={!!visible} onVisibleChange={setVisible} title="Delete Advert" titleClassNames="text-error">
                <div>Are you sure you want to delete this advert? This action is not reversible.</div>
                <ModalFooter
                    onVisibleChange={setVisible}
                    primaryButton={{ text: "Delete", classNames: "btn-error" }}
                    onSubmit={listingId ? () => mutate(listingId) : undefined}
                />
            </Modal>
        </>
    );
};
