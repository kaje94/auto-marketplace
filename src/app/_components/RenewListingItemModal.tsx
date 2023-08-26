import { renewListingAction } from "@/app/_actions/listingActions";
import { Modal, ModalFooter } from "@/app/_components";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ListingIdType } from "@/utils/types";
import { useSession } from "next-auth/react";

interface Props {
    listingId?: ListingIdType;
    listingTitle?: string;
    visible?: boolean;
    setVisible?: (visible: boolean) => void;
}

export const RenewListingItemModal = ({ listingId, listingTitle, visible, setVisible = () => {} }: Props) => {
    const toastId = useRef<string>();
    const session = useSession();

    const { mutate, isLoading } = useMutation((id: number) => renewListingAction(id, session?.data?.user?.id!), {
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(`Renewing advert ${listingTitle}...`);
        },
        onSettled: (_data, err) => {
            setVisible(false);
            if (err) {
                toast.error(`Failed to renew advert ${listingTitle}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully renewed the Advert ${listingTitle}`, { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal visible={!!visible} onVisibleChange={setVisible} title="Renew Advert">
                <div>Are you sure you want to renew the advert {listingTitle}</div>
                <ModalFooter
                    onVisibleChange={setVisible}
                    primaryButton={{ text: "Renew" }}
                    onSubmit={listingId ? () => mutate(listingId) : undefined}
                    loading={isLoading}
                />
            </Modal>
        </>
    );
};
