"use server";
import { api } from "@/utils/api";
import { revalidatePath } from "next/cache";

export const deleteListingAction = async (listingId: number) => {
    await api.deleteListing(listingId);
    revalidatePath(`/dashboard/listings/${listingId}`);
    revalidatePath("/dashboard/listings");
    revalidatePath(`/search/${listingId}`);
};
