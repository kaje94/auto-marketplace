"use client";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { deleteListingAction } from "@/actions/listingActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { useScopedI18n } from "@/locales/client";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
    setVisible?: (visible: boolean) => void;
    successRedirectPath: string;
    visible?: boolean;
}

export const DeleteListingItemModal = (props: Props) => {
    const { listingItem = {}, visible, successRedirectPath, setVisible = () => {} } = props;
    const { id: listingId, title: listingTitle, userId: listingUserId } = listingItem as ListingItem;

    const toastId = useRef<string>();
    const router = useRouter();
    const params = useParams();

    const tCommon = useScopedI18n("common");
    const tDeleteListingItemModal = useScopedI18n("components.modals.deleteListingItemModal");

    const { mutate, isLoading } = useMutation((id: string) => deleteListingAction(id, listingUserId!), {
        onSuccess: (_, id) => {
            if (
                [
                    `/${params.locale}/dashboard/listings/${id}`,
                    `/${params.locale}/dashboard/my-listings/${id}`,
                    `/${params.locale}/search/${id}`,
                ].includes(window?.location?.pathname)
            ) {
                router.replace(`/${params.locale}${successRedirectPath}`);
            }
        },
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(tDeleteListingItemModal("toast.loading", { listingTitle }));
        },
        onSettled: (_data, err) => {
            setVisible(false);
            if (err) {
                toast.error(tDeleteListingItemModal("toast.error", { listingTitle, error: (err as Error)?.message }), { id: toastId?.current });
            } else {
                toast.success(tDeleteListingItemModal("toast.success", { listingTitle }), { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal title={tDeleteListingItemModal("title")} titleClassNames="text-error" visible={!!visible} onVisibleChange={setVisible}>
                <div>{tDeleteListingItemModal("desc")}</div>
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: tCommon("delete"), classNames: "btn-error" }}
                    onSubmit={listingId ? () => mutate(listingId) : undefined}
                    onVisibleChange={setVisible}
                />
            </Modal>
        </>
    );
};
