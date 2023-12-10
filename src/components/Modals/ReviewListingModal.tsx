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
import { useScopedI18n } from "@/locales/client";
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
        defaultValues: { listingId, status: ListingStatusTypes.Posted, reviewComment: "" },
        mode: "all",
    });

    const tReviewListingModal = useScopedI18n("components.modals.reviewListingModal");

    const { mutate, isLoading } = useMutation((reqParams: ReviewListingReq) => reviewListingAction(reqParams, listingUserId!), {
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(tReviewListingModal("toast.loading", { listingTitle }));
        },
        onSettled: (_data, err) => {
            if (err) {
                toast.error(tReviewListingModal("toast.error", { listingTitle, error: (err as Error)?.message }), { id: toastId?.current });
            } else {
                toast.success(tReviewListingModal("toast.success", { listingTitle }), { id: toastId?.current });
            }
        },
    });

    return (
        <Modal title={tReviewListingModal("title")} visible={visible} onVisibleChange={setVisible}>
            <form className="grid gap-1">
                <SelectController
                    control={control}
                    fieldName="status"
                    label={tReviewListingModal("formReviewStatusLabel")}
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
                    label={tReviewListingModal("formReviewCommentLabel")}
                    placeholder={tReviewListingModal("formReviewCommentPlaceholder")}
                    required
                />
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: tReviewListingModal("submitButtonText") }}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    onVisibleChange={setVisible}
                />
            </form>
        </Modal>
    );
};
