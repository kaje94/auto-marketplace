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

const RevalidateRelatedListingsSchema = z.object({ listingId: z.coerce.string() });

type RevalidateRelatedListingsReq = z.infer<typeof RevalidateRelatedListingsSchema>;

export const RevalidateRelatedListings = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const { handleSubmit, control } = useForm<RevalidateRelatedListingsReq>({
        resolver: zodResolver(RevalidateRelatedListingsSchema),
        mode: "all",
    });

    const { mutate, isLoading } = useMutation(
        (req: RevalidateRelatedListingsReq) => {
            return revalidateRelatedListingsAction(req.listingId);
        },
        {
            onMutate: () => setModalVisible(false),
            onSuccess: () => toast.success(`Successfully revalidated related listings`),
            onError: () => toast.error(`Failed to revalidate related listings`),
        },
    );

    return (
        <>
            <button className="btn btn-outline" disabled={isLoading} onClick={() => setModalVisible(true)}>
                Revalidate related listings
            </button>
            <Modal title="Revalidate related listings" visible={!!modalVisible} onVisibleChange={setModalVisible}>
                <form className="grid gap-1">
                    <InputController control={control} fieldName="listingId" label="Listing ID" placeholder="Listing ID" required />
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
