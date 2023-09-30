"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateBrandsAndModelsAction } from "@/actions/cacheActions";

export const RevalidateBrandsAndModels = () => {
    const { mutate, isLoading } = useMutation(async () => revalidateBrandsAndModelsAction(), {
        onSuccess: () => toast.success(`Successfully revalidated brands & models`),
        onError: () => toast.error(`Failed to revalidate brands & models`),
    });

    return (
        <button className="btn-outline btn" disabled={isLoading} onClick={() => mutate()}>
            Revalidate Brands & Models
        </button>
    );
};
