"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { revalidateCityAndStatesAction } from "@/actions/cacheActions";

export const RevalidateCitiesAndStates = () => {
    const { mutate, isLoading } = useMutation(async () => revalidateCityAndStatesAction(), {
        onSuccess: () => toast.success(`Successfully revalidated cities and states`),
        onError: () => toast.error(`Failed to revalidate cities and states`),
    });

    return (
        <button className="btn btn-outline" disabled={isLoading} onClick={() => mutate()}>
            Revalidate Cities & States
        </button>
    );
};
