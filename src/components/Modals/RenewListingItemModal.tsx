import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { renewListingAction } from "@/actions/listingActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
    setVisible?: (visible: boolean) => void;
    visible?: boolean;
}

export const RenewListingItemModal = (props: Props) => {
    const { listingItem = {}, visible, setVisible = () => {} } = props;
    const { id: listingId, title: listingTitle, userId } = listingItem as ListingItem;
    const toastId = useRef<string>();

    const { mutate, isLoading } = useMutation((id: number) => renewListingAction(id, userId!), {
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
            <Modal onVisibleChange={setVisible} title="Renew Advert" visible={!!visible}>
                <div>Are you sure you want to renew the advert {listingTitle}</div>
                <ModalFooter
                    loading={isLoading}
                    onSubmit={listingId ? () => mutate(listingId) : undefined}
                    onVisibleChange={setVisible}
                    primaryButton={{ text: "Renew" }}
                />
            </Modal>
        </>
    );
};