"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateAllPosedListingsAction } from "@/actions/cacheActions";
import { useScopedI18n } from "@/locales/client";

export const RevalidateAllPostedListings = () => {
    const tRevalidateAllPostedListings = useScopedI18n("components.manageCache.revalidateAllPostedListings");

    const { mutate, isLoading } = useMutation(async () => revalidateAllPosedListingsAction(), {
        onSuccess: () => toast.success(tRevalidateAllPostedListings("toast.success")),
        onError: () => toast.error(tRevalidateAllPostedListings("toast.error")),
    });

    return (
        <button className="btn btn-outline" disabled={isLoading} onClick={() => mutate()}>
            {tRevalidateAllPostedListings("buttonText")}
        </button>
    );
};
