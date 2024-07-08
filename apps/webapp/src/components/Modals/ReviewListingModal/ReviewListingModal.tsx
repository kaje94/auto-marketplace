"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { z } from "zod";
import { reviewListingAction } from "@/actions/adminListingActions";
import { Modal, ModalFooter, ModalProps } from "@/components/Common/Modal";
import { SelectController } from "@/components/FormElements/Select";
import { TextAreaController } from "@/components/FormElements/TextArea";
import { ListingStatusTypes } from "@/utils/enum";
import { getListingTitleFromListing, unCamelCase } from "@/utils/helpers";

interface Props extends ModalProps {
    /** Listing item that needs to be reviewed */
    listingItem?: ListingItem;
}

/** Modal to be used by admins to review and approve/reject a new listing */
export const ReviewListingModal = (props: Props) => {
    const { listingItem = {}, onVisibleChange, visible } = props;
    const { id: listingId, data, user } = listingItem as ListingItem;
    const listingTitle = getListingTitleFromListing(data!);

    const toastId = useRef<string>();

    const { handleSubmit, control } = useForm({
        resolver: zodResolver(z.object({ status: z.nativeEnum(ListingStatusTypes), reviewComment: z.string() })),
        defaultValues: { status: ListingStatusTypes.Posted, reviewComment: "" },
        mode: "all",
    });

    const { mutate, isLoading } = useMutation(
        (reqParams: { reviewComment: string; status: ListingStatusTypes }) =>
            reviewListingAction(listingId, reqParams.status, reqParams.reviewComment, user?.email!),
        {
            onMutate: () => {
                onVisibleChange(false);
                toastId.current = toast.loading(`Submitting review for advert ${listingTitle}...`);
            },
            onSettled: (_data, err) => {
                if (err) {
                    toast.error(`Failed to update the status of the advert ${listingTitle}. ${(err as Error)?.message ?? ""}`, {
                        id: toastId?.current,
                    });
                } else {
                    toast.success(`Successfully updated the status of the advert ${listingTitle}`, { id: toastId?.current });
                }
            },
        },
    );

    return (
        <Modal title="Review Advert" visible={visible} onVisibleChange={onVisibleChange}>
            <form className="grid gap-1">
                <SelectController
                    control={control}
                    fieldName="status"
                    label="Review Status"
                    options={[
                        { label: unCamelCase(ListingStatusTypes.Posted), value: ListingStatusTypes.Posted },
                        { label: unCamelCase(ListingStatusTypes.Declined), value: ListingStatusTypes.Declined },
                    ]}
                    selectablePlaceholder={false}
                    required
                />
                <TextAreaController
                    control={control}
                    fieldName="reviewComment"
                    label="Review comment"
                    placeholder="Additional details related to the advert review"
                    required
                />
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: "Submit Review" }}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    onVisibleChange={onVisibleChange}
                />
            </form>
        </Modal>
    );
};
