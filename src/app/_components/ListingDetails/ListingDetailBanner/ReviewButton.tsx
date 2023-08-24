"use client";
import { useRef, useState } from "react";
import { ListingStatusTypes } from "@/utils/enum";
import { unCamelCase } from "@/utils/helpers";
import { ReviewListingSchema } from "@/utils/schemas";
import { ListingIdType, ReviewListingReq } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, TextArea, ModalFooter, Modal } from "@/app/_components";
import { useMutation } from "@tanstack/react-query";
import { reviewListingAction } from "@/app/_actions/listingActions";
import toast from "react-hot-toast";

export const ReviewButton = ({ listingId, listingName }: { listingId: ListingIdType; listingName?: string }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const toastId = useRef<string>();

    const { formState, handleSubmit, register } = useForm<ReviewListingReq>({
        resolver: zodResolver(ReviewListingSchema),
        defaultValues: { listingId, status: ListingStatusTypes.Posted },
        mode: "all",
    });

    const { mutate, isLoading } = useMutation((reqParams: ReviewListingReq) => reviewListingAction(reqParams), {
        onMutate: () => {
            setModalVisible(false);
            toastId.current = toast.loading(`Submitting review for advert ${listingName}...`);
        },
        onSettled: (_data, err) => {
            if (err) {
                toast.error(`Failed to update the status of the advert ${listingName}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully updated the status of the advert ${listingName}`, { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <button className="btn-ghost btn-sm btn" onClick={() => setModalVisible(true)}>
                Review
            </button>
            <Modal visible={modalVisible} onVisibleChange={setModalVisible} title="Review Advert">
                <form className="grid gap-1">
                    <Select
                        label="Review Status"
                        selectablePlaceholder={false}
                        options={[
                            { label: unCamelCase(ListingStatusTypes.Posted), value: ListingStatusTypes.Posted },
                            { label: unCamelCase(ListingStatusTypes.Declined), value: ListingStatusTypes.Declined },
                        ]}
                        error={formState.errors.status?.message}
                        required
                        {...register("status")}
                    />
                    <TextArea
                        label="Review comment"
                        placeholder="Additional details related to the advert review"
                        error={formState.errors.reviewComment?.message}
                        required
                        {...register("reviewComment")}
                    />
                    <ModalFooter
                        primaryButton={{ text: "Submit Review" }}
                        onVisibleChange={setModalVisible}
                        onSubmit={handleSubmit((values) => mutate(values))}
                        loading={isLoading}
                    />
                </form>
            </Modal>
        </>
    );
};
