"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { toggleListingSubscriptionAction } from "@/actions/listingSubscriptionActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { DatePickerController } from "@/components/FormElements/DatePicker";
import { Dates } from "@/utils/constants";
import { ToggleSubscriptionSchema } from "@/utils/schemas";
import { ListingSubscriptionItem, ToggleSubscriptionReq } from "@/utils/types";

interface Props {
    listingSubscriptionItem?: ListingSubscriptionItem;
    setVisible: (visible: boolean) => void;
    visible: boolean;
}

export const ToggleSubscriptionActivationModal = (props: Props) => {
    const { listingSubscriptionItem = {}, setVisible, visible } = props;
    const { id, userId, displayName, active } = listingSubscriptionItem as ListingSubscriptionItem;
    const toastId = useRef<string>();

    const { handleSubmit, control } = useForm<ToggleSubscriptionReq>({
        resolver: zodResolver(ToggleSubscriptionSchema),
        defaultValues: {
            listingSubscriptionId: id,
            subscriptionExpiryDate: active ? Dates.Days_7_from_now : Dates.Days_7_from_now,
        },
        mode: "all",
    });

    const { mutate, isLoading } = useMutation(
        (reqParams: ToggleSubscriptionReq) => {
            return toggleListingSubscriptionAction({ ...reqParams, subscriptionExpiryDate: new Date(reqParams.subscriptionExpiryDate) }, userId!);
        },
        {
            onMutate: () => {
                setVisible(false);
                toastId.current = toast.loading(`${active ? "Deactivating" : "Activating"} subscription ${displayName}...`);
            },
            onSettled: (_data, err, variables) => {
                if (err) {
                    toast.error(`Failed to update the status of the subscription ${displayName}. ${(err as Error)?.message ?? ""}`, {
                        id: toastId?.current,
                    });
                } else {
                    toast.success(`Successfully updated the subscription ${displayName}`, { id: toastId?.current });
                }
            },
        },
    );

    return (
        <Modal title={`${active ? "Deactivate" : "Activate"} Subscription`} visible={visible} onVisibleChange={setVisible}>
            <div className="mb-2 mt-4 text-sm">
                {active
                    ? "By deactivating the subscription, you will stop receiving notifications related to your subscription criteria"
                    : "By Re-activating the subscription, you will start to receive notifications related to your subscription criteria until the subscription expiry date"}
            </div>
            <form className="grid gap-1">
                {!active && (
                    <DatePickerController
                        control={control}
                        fieldName="subscriptionExpiryDate"
                        label="Expiry date"
                        minDate={new Date(new Date().setHours(new Date().getHours() + 24 * 7))}
                        inline
                        required
                    />
                )}
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: active ? "Deactivate" : "Activate" }}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    onVisibleChange={setVisible}
                />
            </form>
        </Modal>
    );
};
