import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { renewListingAction } from "@/actions/userListingActions";
import { Modal, ModalFooter, ModalProps } from "@/components/Common/Modal";
import { getListingTitleFromListing } from "@/utils/helpers";

interface Props extends ModalProps {
    /** The listing item to be re-list.  */
    listingItem?: ListingItem;
}

/** Modal to be used to let users to list their listings after temporarily unlisting it */
export const RelistListingItemModal = (props: Props) => {
    const { listingItem = {}, visible, onVisibleChange = () => {} } = props;
    const { id: listingId, user, data } = listingItem as ListingItem;
    const listingTitle = getListingTitleFromListing(data!);
    const toastId = useRef<string>();

    const { mutate, isLoading } = useMutation((id: string) => renewListingAction(id, user?.email!), {
        onMutate: () => {
            onVisibleChange(false);
            toastId.current = toast.loading(`Relisting advert ${listingTitle}...`);
        },
        onSettled: (_data, err) => {
            onVisibleChange(false);
            if (err) {
                toast.error(`Failed to relist advert ${listingTitle}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully relisted the Advert ${listingTitle}`, { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal title="Relist Advert" visible={!!visible} onVisibleChange={onVisibleChange}>
                <div>
                    This listing advert has been temporarily unlisted/removed. Are you sure you want to relist the advert and make it publicly
                    viewable?
                </div>
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: "Relist" }}
                    onSubmit={listingId ? () => mutate(listingId) : undefined}
                    onVisibleChange={onVisibleChange}
                />
            </Modal>
        </>
    );
};
