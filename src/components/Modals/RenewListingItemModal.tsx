"use client";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { renewListingAction } from "@/actions/listingActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { useScopedI18n } from "@/locales/client";
import { formatHumanFriendlyDate } from "@/utils/helpers";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
    setVisible?: (visible: boolean) => void;
    visible?: boolean;
}

export const RenewListingItemModal = (props: Props) => {
    const { listingItem = {}, visible, setVisible = () => {} } = props;
    const { id: listingId, title: listingTitle, userId, expiryDate } = listingItem as ListingItem;
    const toastId = useRef<string>();

    const tCommon = useScopedI18n("common");
    const tRenewListingModal = useScopedI18n("components.modals.renewListingModal");

    const { mutate, isLoading } = useMutation((id: string) => renewListingAction(id, userId!), {
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(tRenewListingModal("toast.loading", { listingTitle }));
        },
        onSettled: (_data, err) => {
            setVisible(false);
            if (err) {
                toast.error(tRenewListingModal("toast.error", { listingTitle, error: (err as Error)?.message }), { id: toastId?.current });
            } else {
                toast.success(tRenewListingModal("toast.success", { listingTitle }), { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal title={tRenewListingModal("title")} visible={!!visible} onVisibleChange={setVisible}>
                <div>{tRenewListingModal("desc", { date: formatHumanFriendlyDate(new Date(expiryDate)) })}</div>
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: tCommon("renew") }}
                    onSubmit={listingId ? () => mutate(listingId) : undefined}
                    onVisibleChange={setVisible}
                />
            </Modal>
        </>
    );
};
