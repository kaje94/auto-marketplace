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

const RevalidateUserProfileSchema = z.object({ userId: z.string() });

type RevalidateUserProfileSchemaReq = z.infer<typeof RevalidateUserProfileSchema>;

export const RevalidateUserProfileDetails = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const { handleSubmit, control } = useForm<RevalidateUserProfileSchemaReq>({
        resolver: zodResolver(RevalidateUserProfileSchema),
        mode: "all",
    });

    const { mutate, isLoading } = useMutation(
        (req: RevalidateUserProfileSchemaReq) => {
            return revalidateUserProfileDetails(req.userId);
        },
        {
            onMutate: () => setModalVisible(false),
            onSuccess: () => toast.success(`Successfully revalidated user profile`),
            onError: () => toast.error(`Failed to revalidate user profile`),
        },
    );

    return (
        <>
            <button className="btn btn-outline" disabled={isLoading} onClick={() => setModalVisible(true)}>
                Revalidate user profile details
            </button>
            <Modal title="Revalidate user profile details" visible={!!modalVisible} onVisibleChange={setModalVisible}>
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
