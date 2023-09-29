"use client";
import { useRef } from "react";
import { ListingStatusTypes } from "@/utils/enum";
import { unCamelCase } from "@/utils/helpers";
import { ReviewListingSchema } from "@/utils/schemas";
import { ListingItem, ReviewListingReq } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ModalFooter, Modal } from "@/app/_components";
import { useMutation } from "@tanstack/react-query";
import { reviewListingAction } from "@/app/_actions/listingActions";
import toast from "react-hot-toast";
import { TextAreaController } from "@/app/_components/FormElements/TextArea";
import { SelectController } from "@/app/_components/FormElements/Select";

interface Props {
    listingItem?: ListingItem;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export const ReviewListingModal = (props: Props) => {
    const { listingItem = {}, setVisible, visible } = props;
    const { id: listingId, title: listingTitle, userId: listingUserId } = listingItem as ListingItem;
    const toastId = useRef<string>();

    const { formState, handleSubmit, register, control } = useForm<ReviewListingReq>({
        resolver: zodResolver(ReviewListingSchema),
        defaultValues: { listingId, status: ListingStatusTypes.Posted },
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
        <Modal visible={visible} onVisibleChange={setVisible} title="Review Advert">
            <form className="grid gap-1">
                <SelectController
                    label="Review Status"
                    selectablePlaceholder={false}
                    options={[
                        { label: unCamelCase(ListingStatusTypes.Posted), value: ListingStatusTypes.Posted },
                        { label: unCamelCase(ListingStatusTypes.Declined), value: ListingStatusTypes.Declined },
                    ]}
                    required
                    control={control}
                    fieldName="status"
                />
                <TextAreaController
                    label="Review comment"
                    placeholder="Additional details related to the advert review"
                    required
                    fieldName="reviewComment"
                    control={control}
                />
                <ModalFooter
                    primaryButton={{ text: "Submit Review" }}
                    onVisibleChange={setVisible}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    loading={isLoading}
                />
            </form>
        </Modal>
    );
};
