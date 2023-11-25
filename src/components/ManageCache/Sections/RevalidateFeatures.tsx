"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateFeaturesAction } from "@/actions/cacheActions";

export const RevalidateFeatures = () => {
    const { mutate, isLoading } = useMutation(async () => revalidateFeaturesAction(), {
        onSuccess: () => toast.success(`Successfully revalidated features`),
        onError: () => toast.error(`Failed to revalidate Features`),
    });

    return (
        <button className="btn btn-outline" disabled={isLoading} onClick={() => mutate()}>
            Revalidate Features
        </button>
    );
};
