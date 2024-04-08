import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { SubscriptionItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { deleteListingSubscriptionAction } from "@/actions/userSubscriptionActions";
import { Modal, ModalFooter, ModalProps } from "@/components/Common/Modal";

interface Props extends ModalProps {
    /** The listing subscription item. */
    subscriptionItem?: SubscriptionItem;
}

/** Modal to be used when asking confirmation from user before deleting a subscription */
export const DeleteSubscriptionItemModal = (props: Props) => {
    const { subscriptionItem = {}, visible, onVisibleChange = () => {} } = props;
    const { id, data } = subscriptionItem as SubscriptionItem;

    const toastId = useRef<string>();

    const { mutate, isLoading } = useMutation(
        (id: string) => deleteListingSubscriptionAction(id, (subscriptionItem as SubscriptionItem)?.user?.email!),
        {
            onMutate: () => {
                onVisibleChange(false);
                toastId.current = toast.loading(`Deleting subscription ${data?.displayName}...`);
            },
            onSettled: (_data, err) => {
                onVisibleChange(false);
                if (err) {
                    toast.error(`Failed to delete subscription ${data?.displayName}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
                } else {
                    toast.success(`Successfully deleted the subscription ${data?.displayName}`, { id: toastId?.current });
                }
            },
        },
    );

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
