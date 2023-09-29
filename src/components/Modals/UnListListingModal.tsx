"use client";
import { useRef } from "react";
import { ListingStatusTypes } from "@/utils/enum";
import { unCamelCase } from "@/utils/helpers";
import { UnListListingSchema } from "@/utils/schemas";
import { LabelValue, ListingItem, UnListListingReq } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { useMutation } from "@tanstack/react-query";
import { unListListingAction } from "@/actions/listingActions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { SelectController } from "@/components/FormElements/Select";

interface Props {
    listingItem?: ListingItem;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export const UnListListingModal = (props: Props) => {
    const { listingItem = {}, setVisible, visible } = props;
    const { id: listingId, title: listingTitle, userId: listingUserId } = listingItem as ListingItem;
    const toastId = useRef<string>();
    const router = useRouter();

    const { handleSubmit, control } = useForm<UnListListingReq>({
        resolver: zodResolver(UnListListingSchema),
        defaultValues: { listingId, listingStatus: ListingStatusTypes.Sold },
        mode: "all",
    });

    const { mutate, isLoading } = useMutation((reqParams: UnListListingReq) => unListListingAction(reqParams, listingUserId!), {
        onSuccess: (_, id) => {
            if (window?.location?.pathname === `/search/${id}`) {
                router.replace(`/dashboard/listings/${id}`);
            }
        },
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(`Unlisting advert ${listingTitle}...`);
        },
        onSettled: (_data, err) => {
            if (err) {
                toast.error(`Failed to update the status of the advert ${listingTitle}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                toast.success(`Successfully updated the status of the advert ${listingTitle}`, { id: toastId?.current });
            }
        },
    });

    const selectOptions: LabelValue[] = [];
    if ((listingItem as ListingItem)?.status !== ListingStatusTypes.TemporarilyUnlisted) {
        selectOptions.push({ label: unCamelCase(ListingStatusTypes.TemporarilyUnlisted), value: ListingStatusTypes.TemporarilyUnlisted });
    }
    selectOptions.push(
        { label: unCamelCase(ListingStatusTypes.PermanentlyRemoved), value: ListingStatusTypes.PermanentlyRemoved },
        { label: unCamelCase(ListingStatusTypes.Sold), value: ListingStatusTypes.Sold }
    );

    return (
        <Modal visible={visible} onVisibleChange={setVisible} title="Unlist Advert" titleClassNames="text-error">
            <div className="mb-2 mt-4 text-sm">
                By Unlisting or withdrawing the advert, the advertisement will no longer be visible to the public.
            </div>
            <form className="grid gap-1">
                <SelectController
                    label="Status"
                    selectablePlaceholder={false}
                    options={selectOptions}
                    required
                    control={control}
                    fieldName="listingStatus"
                />
                <ModalFooter
                    primaryButton={{ text: "Submit", classNames: "btn-error" }}
                    onVisibleChange={setVisible}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    loading={isLoading}
                />
            </form>
        </Modal>
    );
};
