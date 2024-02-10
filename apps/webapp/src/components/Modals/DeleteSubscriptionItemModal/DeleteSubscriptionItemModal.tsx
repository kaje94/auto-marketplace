import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { deleteListingSubscriptionAction } from "@/actions/listingSubscriptionActions";
import { Modal, ModalFooter, ModalProps } from "@/components/Common/Modal";
import { ListingSubscriptionItem } from "@/utils/types";

interface Props extends ModalProps {
    /** The listing subscription item. */
    listingSubscriptionItem?: ListingSubscriptionItem;
}

/** Modal to be used when asking confirmation from user before deleting a subscription */
export const DeleteSubscriptionItemModal = (props: Props) => {
    const { listingSubscriptionItem = {}, visible, onVisibleChange = () => {} } = props;
    const { id, displayName, userId } = listingSubscriptionItem as ListingSubscriptionItem;

    const toastId = useRef<string>();

    const { mutate, isLoading } = useMutation((id: string) => deleteListingSubscriptionAction(id, userId!), {
        onMutate: () => {
            onVisibleChange(false);
            toastId.current = toast.loading(`Deleting subscription ${displayName}...`);
        },
        onSettled: (_data, err) => {
            onVisibleChange(false);
            if (err) {
                toast.error(`Failed to delete subscription ${displayName}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully deleted the subscription ${displayName}`, { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal title="Delete Subscription" titleClassNames="text-error" visible={!!visible} onVisibleChange={onVisibleChange}>
                <div>Are you sure you want to delete this advert subscription? This action is not reversible.</div>
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: "Delete", classNames: "btn-error" }}
                    onSubmit={id ? () => mutate(id) : undefined}
                    onVisibleChange={onVisibleChange}
                />
            </Modal>
        </>
    );
};
