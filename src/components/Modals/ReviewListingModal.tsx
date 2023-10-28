"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { reviewListingAction } from "@/actions/listingActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { SelectController } from "@/components/FormElements/Select";
import { TextAreaController } from "@/components/FormElements/TextArea";
import { ListingStatusTypes } from "@/utils/enum";
import { unCamelCase } from "@/utils/helpers";
import { ReviewListingSchema } from "@/utils/schemas";
import { ListingItem, ReviewListingReq } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
    setVisible: (visible: boolean) => void;
    visible: boolean;
}

export const ReviewListingModal = (props: Props) => {
    const { listingItem = {}, setVisible, visible } = props;
    const { id: listingId, title: listingTitle, userId: listingUserId } = listingItem as ListingItem;
    const toastId = useRef<string>();

    const { handleSubmit, control } = useForm<ReviewListingReq>({
        resolver: zodResolver(ReviewListingSchema),
        defaultValues: { listingId, status: ListingStatusTypes.Posted, reviewComment:'' },
        mode: "all",
    });

    const { mutate, isLoading } = useMutation((reqParams: ReviewListingReq) => reviewListingAction(reqParams, listingUserId!), {
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(`Submitting review for advert ${listingTitle}...`);
        },
        onSettled: (_data, err) => {
            if (err) {
                toast.error(`Failed to update the status of the advert ${listingTitle}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully updated the status of the advert ${listingTitle}`, { id: toastId?.current });
            }
        },
    });

    return (
        <Modal onVisibleChange={setVisible} title="Review Advert" visible={visible}>
            <form className="grid gap-1">
                <SelectController
                    control={control}
                    fieldName="status"
                    label="Review Status"
                    options={[
                        { label: unCamelCase(ListingStatusTypes.Posted), value: ListingStatusTypes.Posted },
                        { label: unCamelCase(ListingStatusTypes.Declined), value: ListingStatusTypes.Declined },
                    ]}
                    required
                    selectablePlaceholder={false}
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
                    onSubmit={handleSubmit((values) => mutate(values))}
                    onVisibleChange={setVisible}
                    primaryButton={{ text: "Submit Review" }}
                />
            </form>
        </Modal>
    );
};
