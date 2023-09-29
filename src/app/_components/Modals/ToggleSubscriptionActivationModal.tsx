"use client";
import { useRef } from "react";
import { ToggleSubscriptionSchema } from "@/utils/schemas";
import { ListingSubscriptionItem, ToggleSubscriptionReq } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ModalFooter, Modal } from "@/app/_components";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { toggleListingSubscriptionAction } from "@/app/_actions/listingSubscriptionActions";
import { Dates } from "@/utils/constants";
import { DatePickerController } from "@/app/_components/FormElements/DatePicker";

interface Props {
    listingSubscriptionItem?: ListingSubscriptionItem;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export const ToggleSubscriptionActivationModal = (props: Props) => {
    const { listingSubscriptionItem = {}, setVisible, visible } = props;
    const { id, userId, displayName, active } = listingSubscriptionItem as ListingSubscriptionItem;
    const toastId = useRef<string>();

    const { formState, handleSubmit, control } = useForm<ToggleSubscriptionReq>({
        resolver: zodResolver(ToggleSubscriptionSchema),
        defaultValues: {
            listingSubscriptionId: id,
            subscriptionExpiryDate: active ? Dates.Days_7_from_now : Dates.Days_7_from_now,
        },
        mode: "all",
    });

    const { mutate, isLoading } = useMutation((reqParams: ToggleSubscriptionReq) => toggleListingSubscriptionAction(reqParams, userId!), {
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(`${active ? "Deactivating" : "Activating"} subscription ${displayName}...`);
        },
        onSettled: (_data, err) => {
            if (err) {
                toast.error(`Failed to update the status of the subscription ${displayName}. ${(err as Error)?.message ?? ""}`, {
                    id: toastId?.current,
                });
            } else {
                toast.success(`Successfully updated the subscription ${displayName}`, { id: toastId?.current });
            }
        },
    });

    return (
        <Modal visible={visible} onVisibleChange={setVisible} title={`${active ? "Deactivate" : "Activate"} Subscription`}>
            <div className="mb-2 mt-4 text-sm">
                {active
                    ? "By deactivating the subscription, you will stop receiving notifications related to your subscription criteria"
                    : "By Re-activating the subscription, you will start to receive notifications related to your subscription criteria until the subscription expiry date"}
            </div>
            <form className="grid gap-1">
                {!active && (
                    <DatePickerController
                        label="Expiry date"
                        minDate={new Date(new Date().setHours(new Date().getHours() + 24 * 7))}
                        inline
                        required
                        control={control}
                        fieldName="subscriptionExpiryDate"
                    />
                )}
                <ModalFooter
                    primaryButton={{ text: active ? "Deactivate" : "Activate" }}
                    onVisibleChange={setVisible}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    loading={isLoading}
                />
            </form>
        </Modal>
    );
};
