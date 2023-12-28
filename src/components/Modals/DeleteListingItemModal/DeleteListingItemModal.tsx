import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { deleteListingAction } from "@/actions/listingActions";
import { Modal, ModalFooter, ModalProps } from "@/components/Common/Modal";
import { ListingItem } from "@/utils/types";

interface Props extends ModalProps {
    /** The listing item to be deleted. */
    listingItem?: ListingItem;
    /** The path to redirect to after successful deletion. */
    successRedirectPath: string;
}

/** Modal to be used to ask confirmation from user before deleting a listing */
export const DeleteListingItemModal = (props: Props) => {
    const { listingItem = {}, visible, successRedirectPath, onVisibleChange = () => {} } = props;
    const { id: listingId, title: listingTitle, userId: listingUserId } = listingItem as ListingItem;

    const toastId = useRef<string>();
    const router = useRouter();
    const params = useParams();

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
            onVisibleChange(false);
            toastId.current = toast.loading(`Deleting advert ${listingTitle}...`);
        },
        onSettled: (_data, err) => {
            onVisibleChange(false);
            if (err) {
                toast.error(`Failed to delete advert ${listingTitle}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully deleted the Advert ${listingTitle}`, { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal title="Delete Advert" titleClassNames="text-error" visible={!!visible} onVisibleChange={onVisibleChange}>
                <div>Are you sure you want to delete this advert? This action is not reversible.</div>
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: "Delete", classNames: "btn-error", testId: `confirm-delete-btn` }}
                    onSubmit={listingId ? () => mutate(listingId) : undefined}
                    onVisibleChange={onVisibleChange}
                />
            </Modal>
        </>
    );
};
