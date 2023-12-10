"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateBrandsAction } from "@/actions/cacheActions";
import { useScopedI18n } from "@/locales/client";

export const RevalidateVehicleBrands = () => {
    const tRevalidateVehicleBrands = useScopedI18n("components.manageCache.revalidateVehicleBrands");

    const { mutate, isLoading } = useMutation(async () => revalidateBrandsAction(), {
        onSuccess: () => toast.success(tRevalidateVehicleBrands("toast.success")),
        onError: () => toast.error(tRevalidateVehicleBrands("toast.error")),
    });

    return (
        <button className="btn btn-outline" disabled={isLoading} onClick={() => mutate()}>
            {tRevalidateVehicleBrands("buttonText")}
        </button>
    );
};
