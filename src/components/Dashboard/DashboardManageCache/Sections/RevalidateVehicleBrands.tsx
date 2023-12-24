"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateBrandsAction } from "@/actions/cacheActions";

export const RevalidateVehicleBrands = () => {
    const { mutate, isLoading } = useMutation(async () => revalidateBrandsAction(), {
        onSuccess: () => toast.success(`Successfully revalidated vehicle brands`),
        onError: () => toast.error(`Failed to revalidate vehicle brands`),
    });

    return (
        <button className="btn btn-outline" disabled={isLoading} onClick={() => mutate()}>
            Revalidate Vehicle Brands
        </button>
    );
};
