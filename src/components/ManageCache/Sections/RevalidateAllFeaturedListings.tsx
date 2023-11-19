"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateAllFeaturedListingsAction } from "@/actions/cacheActions";

export const RevalidateAllFeaturedListings = () => {
    const { mutate, isLoading } = useMutation(async () => revalidateAllFeaturedListingsAction(), {
        onSuccess: () => toast.success(`Successfully revalidated featured listings`),
        onError: () => toast.error(`Failed to revalidate featured listings`),
    });

    return (
        <button className="btn btn-outline" disabled={isLoading} onClick={() => mutate()}>
            Revalidate featured listings
        </button>
    );
};
