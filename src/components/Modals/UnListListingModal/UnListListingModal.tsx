"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { unListListingAction } from "@/actions/listingActions";
import { Modal, ModalFooter, ModalProps } from "@/components/Common/Modal";
import { SelectController } from "@/components/FormElements/Select";
import { ListingStatusTypes } from "@/utils/enum";
import { unCamelCase } from "@/utils/helpers";
import { UnListListingSchema } from "@/utils/schemas";
import { LabelValue, ListingItem, UnListListingReq } from "@/utils/types";

interface Props extends ModalProps {
    /** Listing item that needs to be unlisted */
    listingItem?: ListingItem;
}

/** Modal to be used in order to unlist an advert temporarily or permanently */
export const UnListListingModal = (props: Props) => {
    const { listingItem = {}, onVisibleChange, visible } = props;
    const { id: listingId, title: listingTitle, userId: listingUserId } = listingItem as ListingItem;
    const toastId = useRef<string>();
    const router = useRouter();
    const params = useParams();

    const { handleSubmit, control } = useForm<UnListListingReq>({
        resolver: zodResolver(UnListListingSchema),
        defaultValues: { listingId, listingStatus: ListingStatusTypes.Sold },
        mode: "all",
    });

    const { mutate, isLoading } = useMutation((reqParams: UnListListingReq) => unListListingAction(reqParams, listingUserId!), {
        onSuccess: (_, id) => {
            if (window?.location?.pathname === `/${params.locale}/search/${id}`) {
                router.replace(`/${params.locale}/dashboard/listings/${id}`);
            }
        },
        onMutate: () => {
            onVisibleChange(false);
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
        { label: unCamelCase(ListingStatusTypes.Sold), value: ListingStatusTypes.Sold },
    );

    return (
        <Modal title="Unlist Advert" titleClassNames="text-error" visible={visible} onVisibleChange={onVisibleChange}>
            <div className="mb-2 mt-4 text-sm">
                By Unlisting or withdrawing the advert, the advertisement will no longer be visible to the public.
            </div>
            <form className="grid gap-1">
                <SelectController
                    control={control}
                    fieldName="listingStatus"
                    label="Status"
                    options={selectOptions}
                    selectablePlaceholder={false}
                    required
                />
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: "Submit", classNames: "btn-error" }}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    onVisibleChange={onVisibleChange}
                />
            </form>
        </Modal>
    );
};
