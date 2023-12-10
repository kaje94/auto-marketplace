"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { revalidateRelatedListingsAction } from "@/actions/cacheActions";
import { Modal, ModalFooter } from "@/components/Common";
import { InputController } from "@/components/FormElements/Input";
import { useScopedI18n } from "@/locales/client";

const RevalidateRelatedListingsSchema = z.object({ listingId: z.coerce.string() });

type RevalidateRelatedListingsReq = z.infer<typeof RevalidateRelatedListingsSchema>;

export const RevalidateRelatedListings = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const { handleSubmit, control } = useForm<RevalidateRelatedListingsReq>({
        resolver: zodResolver(RevalidateRelatedListingsSchema),
        mode: "all",
    });

    const tRevalidateRelatedListings = useScopedI18n("components.manageCache.revalidateRelatedListings");
    const tCommon = useScopedI18n("common");
    const tForm = useScopedI18n("form");

    const { mutate, isLoading } = useMutation(
        (req: RevalidateRelatedListingsReq) => {
            return revalidateRelatedListingsAction(req.listingId);
        },
        {
            onMutate: () => setModalVisible(false),
            onSuccess: () => toast.success(tRevalidateRelatedListings("toast.success")),
            onError: () => toast.error(tRevalidateRelatedListings("toast.error")),
        },
    );

    return (
        <>
            <button className="btn btn-outline" disabled={isLoading} onClick={() => setModalVisible(true)}>
                {tRevalidateRelatedListings("buttonText")}
            </button>
            <Modal title={tRevalidateRelatedListings("buttonText")} visible={!!modalVisible} onVisibleChange={setModalVisible}>
                <form className="grid gap-1">
                    <InputController
                        control={control}
                        fieldName="listingId"
                        label={tForm("listingId.label")}
                        placeholder={tForm("listingId.placeholder")}
                        required
                    />
                    <ModalFooter
                        loading={isLoading}
                        primaryButton={{ text: tCommon("proceed") }}
                        onSubmit={handleSubmit((values) => mutate(values))}
                        onVisibleChange={setModalVisible}
                    />
                </form>
            </Modal>
        </>
    );
};
