"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateAllPosedListingsAction } from "@/actions/cacheActions";

export const RevalidateAllPostedListings = () => {
    const { mutate, isLoading } = useMutation(async () => revalidateAllPosedListingsAction(), {
        onSuccess: () => toast.success(`Successfully revalidated all posted listings`),
        onError: () => toast.error(`Failed to revalidate all posted listings`),
    });

    return (
        <button className="btn btn-outline" disabled={isLoading} onClick={() => mutate()}>
            Revalidate all posted listings
        </button>
    );
};
