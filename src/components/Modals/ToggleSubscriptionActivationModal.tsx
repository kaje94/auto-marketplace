"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { toggleListingSubscriptionAction } from "@/actions/listingSubscriptionActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { DatePickerController } from "@/components/FormElements/DatePicker";
import { useScopedI18n } from "@/locales/client";
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

    const tToggleSubscriptionActivationModal = useScopedI18n("components.modals.toggleSubscriptionActivationModal");
    const tCommon = useScopedI18n("common");

    const { mutate, isLoading } = useMutation(
        (reqParams: ToggleSubscriptionReq) => {
            return toggleListingSubscriptionAction({ ...reqParams, subscriptionExpiryDate: new Date(reqParams.subscriptionExpiryDate) }, userId!);
        },
        {
            onMutate: () => {
                setVisible(false);
                toastId.current = toast.loading(
                    tToggleSubscriptionActivationModal("toast.loading", {
                        displayName,
                        state: active ? tToggleSubscriptionActivationModal("deactivating") : tToggleSubscriptionActivationModal("activating"),
                    }),
                );
            },
            onSettled: (_data, err) => {
                if (err) {
                    toast.error(tToggleSubscriptionActivationModal("toast.error", { displayName, error: (err as Error)?.message }), {
                        id: toastId?.current,
                    });
                } else {
                    toast.success(tToggleSubscriptionActivationModal("toast.success", { displayName }), { id: toastId?.current });
                }
            },
        },
    );

    return (
        <Modal
            title={tToggleSubscriptionActivationModal("title", { state: active ? tCommon("deactivate") : tCommon("activate") })}
            visible={visible}
            onVisibleChange={setVisible}
        >
            <div className="mb-2 mt-4 text-sm">
                {active ? tToggleSubscriptionActivationModal("deactivateDesc") : tToggleSubscriptionActivationModal("activateDesc")}
            </div>
            <form className="grid gap-1">
                {!active && (
                    <DatePickerController
                        control={control}
                        fieldName="subscriptionExpiryDate"
                        label={tToggleSubscriptionActivationModal("formExpiryDateLabel")}
                        minDate={new Date(new Date().setHours(new Date().getHours() + 24 * 7))}
                        inline
                        required
                    />
                )}
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: active ? tCommon("deactivate") : tCommon("activate") }}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    onVisibleChange={setVisible}
                />
            </form>
        </Modal>
    );
};
