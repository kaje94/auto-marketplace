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

const RevalidateUserNotificationsSchema = z.object({ userId: z.string() });

type RevalidateUserNotificationsReq = z.infer<typeof RevalidateUserNotificationsSchema>;

export const RevalidateUserNotifications = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const { handleSubmit, control } = useForm<RevalidateUserNotificationsReq>({
        resolver: zodResolver(RevalidateUserNotificationsSchema),
        mode: "all",
    });

    const { mutate, isLoading } = useMutation(
        (req: RevalidateUserNotificationsReq) => {
            return revalidateUserNotificationsAction(req.userId);
        },
        {
            onMutate: () => setModalVisible(false),
            onSuccess: () => toast.success(`Successfully revalidated user notifications`),
            onError: () => toast.error(`Failed to revalidate user notifications`),
        },
    );

    return (
        <>
            <button className="btn btn-outline" disabled={isLoading} onClick={() => setModalVisible(true)}>
                Revalidate user notifications
            </button>
            <Modal title="Revalidate user notifications" visible={!!modalVisible} onVisibleChange={setModalVisible}>
                <form className="grid gap-1">
                    <InputController control={control} fieldName="userId" label="User ID" placeholder="User ID" required />
                    <ModalFooter
                        loading={isLoading}
                        primaryButton={{ text: "Proceed" }}
                        onSubmit={handleSubmit((values) => mutate(values))}
                        onVisibleChange={setModalVisible}
                    />
                </form>
            </Modal>
        </>
    );
};
