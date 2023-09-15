import { deleteListingAction } from "@/app/_actions/listingActions";
import { Modal, ModalFooter } from "@/app/_components";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ListingItem } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
    visible?: boolean;
    setVisible?: (visible: boolean) => void;
    successRedirectPath: string;
}

export const DeleteListingItemModal = (props: Props) => {
    const { listingItem = {}, visible, successRedirectPath, setVisible = () => {} } = props;
    const { id: listingId, title: listingTitle, userId: listingUserId } = listingItem as ListingItem;

    const toastId = useRef<string>();
    const router = useRouter();

    const { mutate, isLoading } = useMutation((id: number) => deleteListingAction(id, listingUserId!), {
        onSuccess: (_, id) => {
            if ([`/dashboard/listings/${id}`, `/dashboard/my-listings/${id}`, `/search/${id}`].includes(window?.location?.pathname)) {
                router.replace(successRedirectPath);
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
                    loading={isLoading}
                />
            </Modal>
        </>
    );
};