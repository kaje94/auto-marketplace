"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidatePosedListingsAction } from "@/actions/cacheActions";

export const RevalidatePostedListings = () => {
    const { mutate, isLoading } = useMutation(async () => revalidatePosedListingsAction(), {
        onSuccess: () => toast.success(`Successfully revalidated posted listings`),
        onError: () => toast.error(`Failed to revalidate posted listings`),
    });

    return (
        <button className="btn-outline btn" disabled={isLoading} onClick={() => mutate()}>
            Revalidate posted listings
        </button>
    );
};
