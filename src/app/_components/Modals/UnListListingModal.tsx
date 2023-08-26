"use client";
import { useRef } from "react";
import { ListingStatusTypes } from "@/utils/enum";
import { unCamelCase } from "@/utils/helpers";
import { UnListListingSchema } from "@/utils/schemas";
import { ListingItem, UnListListingReq } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select, TextArea, ModalFooter, Modal } from "@/app/_components";
import { useMutation } from "@tanstack/react-query";
import { unListListingAction } from "@/app/_actions/listingActions";
import toast from "react-hot-toast";

interface Props {
    listingItem?: ListingItem;
    visible: boolean;
    setVisible: (visible: boolean) => void;
}

export const UnListListingModal = (props: Props) => {
    const { listingItem = {}, setVisible, visible } = props;
    const { id: listingId, title: listingTitle, userId: listingUserId } = listingItem as ListingItem;
    const toastId = useRef<string>();

    const { formState, handleSubmit, register } = useForm<UnListListingReq>({
        resolver: zodResolver(UnListListingSchema),
        defaultValues: { listingId, listingStatus: ListingStatusTypes.Sold },
        mode: "all",
    });

    const { mutate, isLoading } = useMutation((reqParams: UnListListingReq) => unListListingAction(reqParams, listingUserId!), {
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(`Un-listing advert ${listingTitle}...`);
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
        <Modal visible={visible} onVisibleChange={setVisible} title="Un-List Advert">
            <div className="mb-2 mt-4 text-sm">
                By Un-Listing or withdrawing the advert, the advertisement will no longer be visible to the public.
            </div>
            <form className="grid gap-1">
                <Select
                    label="Status"
                    selectablePlaceholder={false}
                    options={[
                        { label: unCamelCase(ListingStatusTypes.TemporarilyUnlisted), value: ListingStatusTypes.TemporarilyUnlisted },
                        { label: unCamelCase(ListingStatusTypes.PermanentlyRemoved), value: ListingStatusTypes.PermanentlyRemoved },
                        { label: unCamelCase(ListingStatusTypes.Sold), value: ListingStatusTypes.Sold },
                    ]}
                    error={formState.errors?.listingStatus?.message}
                    required
                    {...register("listingStatus")}
                />
                <ModalFooter
                    primaryButton={{ text: "Submit" }}
                    onVisibleChange={setVisible}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    loading={isLoading}
                />
            </form>
        </Modal>
    );
};
