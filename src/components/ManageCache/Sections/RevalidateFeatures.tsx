"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateFeaturesAction } from "@/actions/cacheActions";
import { useScopedI18n } from "@/locales/client";

export const RevalidateFeatures = () => {
    const tRevalidateFeatures = useScopedI18n("components.manageCache.revalidateFeatures");

    const { mutate, isLoading } = useMutation(async () => revalidateFeaturesAction(), {
        onSuccess: () => toast.success(tRevalidateFeatures("toast.success")),
        onError: () => toast.error(tRevalidateFeatures("toast.error")),
    });

    return (
        <button className="btn btn-outline" disabled={isLoading} onClick={() => mutate()}>
            {tRevalidateFeatures("buttonText")}
        </button>
    );
};
