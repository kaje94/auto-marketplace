"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateFeaturedListingsAction } from "@/actions/cacheActions";

export const RevalidateFeaturedListings = () => {
    const { mutate, isLoading } = useMutation(async () => revalidateFeaturedListingsAction(), {
        onSuccess: () => toast.success(`Successfully revalidated featured listings`),
        onError: () => toast.error(`Failed to revalidate featured listings`),
    });

    return (
        <button className="btn-outline btn" disabled={isLoading} onClick={() => mutate()}>
            Revalidate featured listings
        </button>
    );
};
