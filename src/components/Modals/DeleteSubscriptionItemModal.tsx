import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { deleteListingSubscriptionAction } from "@/actions/listingSubscriptionActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { ListingSubscriptionItem } from "@/utils/types";

interface Props {
    listingSubscriptionItem?: ListingSubscriptionItem;
    setVisible?: (visible: boolean) => void;
    visible?: boolean;
}

export const DeleteSubscriptionItemModal = (props: Props) => {
    const { listingSubscriptionItem = {}, visible, setVisible = () => {} } = props;
    const { id, displayName, userId } = listingSubscriptionItem as ListingSubscriptionItem;

    const toastId = useRef<string>();

    const { mutate, isLoading } = useMutation((id: number) => deleteListingSubscriptionAction(id, userId!), {
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(`Deleting subscription ${displayName}...`);
        },
        onSettled: (_data, err) => {
            setVisible(false);
            if (err) {
                toast.error(`Failed to delete subscription ${displayName}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully deleted the subscription ${displayName}`, { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal onVisibleChange={setVisible} title="Delete Subscription" titleClassNames="text-error" visible={!!visible}>
                <div>Are you sure you want to delete this advert subscription? This action is not reversible.</div>
                <ModalFooter
                    loading={isLoading}
                    onSubmit={id ? () => mutate(id) : undefined}
                    onVisibleChange={setVisible}
                    primaryButton={{ text: "Delete", classNames: "btn-error" }}
                />
            </Modal>
        </>
    );
};
