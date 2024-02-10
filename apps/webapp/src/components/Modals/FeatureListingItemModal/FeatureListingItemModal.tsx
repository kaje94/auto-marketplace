import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { makeListingFeatured } from "@/actions/listingActions";
import { Modal, ModalFooter, ModalProps } from "@/components/Common/Modal";
import { ListingItem } from "@/utils/types";

interface Props extends ModalProps {
    /** The listing item to be renewed.  */
    listingItem?: ListingItem;
}

/** Modal to be used mark an advert as featured */
export const FeatureListingItemModal = (props: Props) => {
    const { listingItem = {}, visible, onVisibleChange = () => {} } = props;
    const { id: listingId, title: listingTitle, userId, location } = listingItem as ListingItem;
    const toastId = useRef<string>();

    const { mutate, isLoading } = useMutation((id: string) => makeListingFeatured(id, location.country, userId!), {
        onMutate: () => {
            onVisibleChange(false);
            toastId.current = toast.loading(`Requesting ${listingTitle} to be made as a featured advert...`);
        },
        onSettled: (_data, err) => {
            onVisibleChange(false);
            if (err) {
                toast.error(`Failed to make ${listingTitle} as a featured advert. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully made the advert ${listingTitle} as a featured advert`, { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal title="Convert to a featured advert" visible={!!visible} onVisibleChange={onVisibleChange}>
                <div>
                    By converting this to a featured advert, you can increase its visibility and attract more potential buyers. Featured adverts are
                    prominently displayed on our home page and given priority in search results, ensuring maximum exposure for your listing.
                </div>
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: "Proceed" }}
                    onSubmit={listingId ? () => mutate(listingId) : undefined}
                    onVisibleChange={onVisibleChange}
                />
            </Modal>
        </>
    );
};
