"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { revalidateUserProfileDetails } from "@/actions/cacheActions";
import { Modal, ModalFooter } from "@/components/Common";
import { InputController } from "@/components/FormElements/Input";
import { useScopedI18n } from "@/locales/client";

const RevalidateUserProfileSchema = z.object({ userId: z.string() });

type RevalidateUserProfileSchemaReq = z.infer<typeof RevalidateUserProfileSchema>;

export const RevalidateUserProfileDetails = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const { handleSubmit, control } = useForm<RevalidateUserProfileSchemaReq>({
        resolver: zodResolver(RevalidateUserProfileSchema),
        mode: "all",
    });

    const tRevalidateUserProfile = useScopedI18n("components.manageCache.revalidateUserProfile");
    const tForm = useScopedI18n("form");
    const tCommon = useScopedI18n("common");

    const { mutate, isLoading } = useMutation(
        (req: RevalidateUserProfileSchemaReq) => {
            return revalidateUserProfileDetails(req.userId);
        },
        {
            onMutate: () => setModalVisible(false),
            onSuccess: () => toast.success(tRevalidateUserProfile("toast.success")),
            onError: () => toast.error(tRevalidateUserProfile("toast.error")),
        },
    );

    return (
        <>
            <button className="btn btn-outline" disabled={isLoading} onClick={() => setModalVisible(true)}>
                {tRevalidateUserProfile("buttonText")}
            </button>
            <Modal title={tRevalidateUserProfile("buttonText")} visible={!!modalVisible} onVisibleChange={setModalVisible}>
                <form className="grid gap-1">
                    <InputController
                        control={control}
                        fieldName="userId"
                        label={tForm("userId.label")}
                        placeholder={tForm("userId.placeholder")}
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
