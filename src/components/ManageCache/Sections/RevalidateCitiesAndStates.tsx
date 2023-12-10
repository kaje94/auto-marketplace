"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateCityAndStatesAction } from "@/actions/cacheActions";
import { useScopedI18n } from "@/locales/client";

export const RevalidateCitiesAndStates = () => {
    const tRevalidateCitiesAndStates = useScopedI18n("components.manageCache.revalidateCitiesAndStates");

    const { mutate, isLoading } = useMutation(async () => revalidateCityAndStatesAction(), {
        onSuccess: () => toast.success(tRevalidateCitiesAndStates("toast.success")),
        onError: () => toast.error(tRevalidateCitiesAndStates("toast.error")),
    });

    return (
        <button className="btn btn-outline" disabled={isLoading} onClick={() => mutate()}>
            {tRevalidateCitiesAndStates("buttonText")}
        </button>
    );
};
