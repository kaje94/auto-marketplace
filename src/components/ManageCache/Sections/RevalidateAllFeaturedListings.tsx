"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateAllFeaturedListingsAction } from "@/actions/cacheActions";
import { useScopedI18n } from "@/locales/client";

export const RevalidateAllFeaturedListings = () => {
    const tRevalidateAllFeaturedListings = useScopedI18n("components.manageCache.revalidateAllFeaturedListings");

    const { mutate, isLoading } = useMutation(async () => revalidateAllFeaturedListingsAction(), {
        onSuccess: () => toast.success(tRevalidateAllFeaturedListings("toast.success")),
        onError: () => toast.error(tRevalidateAllFeaturedListings("toast.error")),
    });

    return (
        <button className="btn btn-outline" disabled={isLoading} onClick={() => mutate()}>
            {tRevalidateAllFeaturedListings("buttonText")}
        </button>
    );
};
