"use client";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { deleteListingSubscriptionAction } from "@/actions/listingSubscriptionActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { useScopedI18n } from "@/locales/client";
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

    const tCommon = useScopedI18n("common");
    const tDeleteSubscriptionModal = useScopedI18n("components.modals.deleteSubscriptionModal");

    const { mutate, isLoading } = useMutation((id: string) => deleteListingSubscriptionAction(id, userId!), {
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(tDeleteSubscriptionModal("toast.loading", { displayName }));
        },
        onSettled: (_data, err) => {
            setVisible(false);
            if (err) {
                toast.error(tDeleteSubscriptionModal("toast.error", { displayName, error: (err as Error)?.message }), { id: toastId?.current });
            } else {
                toast.success(tDeleteSubscriptionModal("toast.success", { displayName }), { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal title={tDeleteSubscriptionModal("title")} titleClassNames="text-error" visible={!!visible} onVisibleChange={setVisible}>
                <div>{tDeleteSubscriptionModal("desc")}</div>
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: tCommon("delete"), classNames: "btn-error" }}
                    onSubmit={id ? () => mutate(id) : undefined}
                    onVisibleChange={setVisible}
                />
            </Modal>
        </>
    );
};
