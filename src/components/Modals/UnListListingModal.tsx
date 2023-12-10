"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { unListListingAction } from "@/actions/listingActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { SelectController } from "@/components/FormElements/Select";
import { useScopedI18n } from "@/locales/client";
import { ListingStatusTypes } from "@/utils/enum";
import { unCamelCase } from "@/utils/helpers";
import { UnListListingSchema } from "@/utils/schemas";
import { LabelValue, ListingItem, UnListListingReq } from "@/utils/types";

interface Props {
    listingItem?: ListingItem;
    setVisible: (visible: boolean) => void;
    visible: boolean;
}

export const UnListListingModal = (props: Props) => {
    const { listingItem = {}, setVisible, visible } = props;
    const { id: listingId, title: listingTitle, userId: listingUserId } = listingItem as ListingItem;
    const toastId = useRef<string>();
    const router = useRouter();
    const params = useParams();

    const { handleSubmit, control } = useForm<UnListListingReq>({
        resolver: zodResolver(UnListListingSchema),
        defaultValues: { listingId, listingStatus: ListingStatusTypes.Sold },
        mode: "all",
    });

    const tUnListListingModal = useScopedI18n("components.modals.unListListingModal");
    const tForm = useScopedI18n("form");

    const { mutate, isLoading } = useMutation((reqParams: UnListListingReq) => unListListingAction(reqParams, listingUserId!), {
        onSuccess: (_, id) => {
            if (window?.location?.pathname === `/${params.locale}/search/${id}`) {
                router.replace(`/${params.locale}/dashboard/listings/${id}`);
            }
        },
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(tUnListListingModal("toast.loading", { listingTitle }));
        },
        onSettled: (_data, err) => {
            if (err) {
                toast.error(tUnListListingModal("toast.error", { listingTitle, error: (err as Error)?.message }), { id: toastId?.current });
            } else {
                toast.success(tUnListListingModal("toast.success", { listingTitle }), { id: toastId?.current });
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
        <Modal title={tUnListListingModal("title")} titleClassNames="text-error" visible={visible} onVisibleChange={setVisible}>
            <div className="mb-2 mt-4 text-sm">{tUnListListingModal("desc")} </div>
            <form className="grid gap-1">
                <SelectController
                    control={control}
                    fieldName="listingStatus"
                    label={tUnListListingModal("formStatusLabel")}
                    options={selectOptions}
                    selectablePlaceholder={false}
                    required
                />
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: tForm("buttons.submit.label"), classNames: "btn-error" }}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    onVisibleChange={setVisible}
                />
            </form>
        </Modal>
    );
};
