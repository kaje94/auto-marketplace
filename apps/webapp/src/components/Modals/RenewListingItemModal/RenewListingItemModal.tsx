import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { renewListingAction } from "@/actions/userListingActions";
import { Modal, ModalFooter, ModalProps } from "@/components/Common/Modal";
import { formatHumanFriendlyDate, getListingTitleFromListing } from "@/utils/helpers";

interface Props extends ModalProps {
    /** The listing item to be renewed.  */
    listingItem?: ListingItem;
}

/** Modal to be used to let users to renew listings */
export const RenewListingItemModal = (props: Props) => {
    const { listingItem = {}, visible, onVisibleChange = () => {} } = props;
    const { id: listingId, expiryDate, data, user } = listingItem as ListingItem;
    const listingTitle = getListingTitleFromListing(data!);

    const toastId = useRef<string>();

    const { mutate, isLoading } = useMutation((id: string) => renewListingAction(id, user?.email!), {
        onMutate: () => {
            onVisibleChange(false);
            toastId.current = toast.loading(`Renewing advert ${listingTitle}...`);
        },
        onSettled: (_data, err) => {
            onVisibleChange(false);
            if (err) {
                toast.error(`Failed to renew advert ${listingTitle}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully renewed the Advert ${listingTitle}`, { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal title="Renew Advert" visible={!!visible} onVisibleChange={onVisibleChange}>
                <div>
                    This listing advert will expire on {formatHumanFriendlyDate(new Date(expiryDate))}. Are you sure you want to renew the advert?
                </div>
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: "Renew" }}
                    onSubmit={listingId ? () => mutate(listingId) : undefined}
                    onVisibleChange={onVisibleChange}
                />
            </Modal>
        </>
    );
};
