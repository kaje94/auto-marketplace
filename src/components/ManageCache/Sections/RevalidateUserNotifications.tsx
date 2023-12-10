"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { revalidateUserNotificationsAction } from "@/actions/cacheActions";
import { Modal, ModalFooter } from "@/components/Common";
import { InputController } from "@/components/FormElements/Input";
import { useScopedI18n } from "@/locales/client";

const RevalidateUserNotificationsSchema = z.object({ userId: z.string() });

type RevalidateUserNotificationsReq = z.infer<typeof RevalidateUserNotificationsSchema>;

export const RevalidateUserNotifications = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const { handleSubmit, control } = useForm<RevalidateUserNotificationsReq>({
        resolver: zodResolver(RevalidateUserNotificationsSchema),
        mode: "all",
    });

    const tRevalidateUserNotifications = useScopedI18n("components.manageCache.revalidateUserNotifications");
    const tForm = useScopedI18n("form");
    const tCommon = useScopedI18n("common");

    const { mutate, isLoading } = useMutation(
        (req: RevalidateUserNotificationsReq) => {
            return revalidateUserNotificationsAction(req.userId);
        },
        {
            onMutate: () => setModalVisible(false),
            onSuccess: () => toast.success(tRevalidateUserNotifications("toast.success")),
            onError: () => toast.error(tRevalidateUserNotifications("toast.error")),
        },
    );

    return (
        <>
            <button className="btn btn-outline" disabled={isLoading} onClick={() => setModalVisible(true)}>
                {tRevalidateUserNotifications("buttonText")}
            </button>
            <Modal title={tRevalidateUserNotifications("buttonText")} visible={!!modalVisible} onVisibleChange={setModalVisible}>
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
