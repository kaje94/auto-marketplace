"use server";
import { revalidateTag } from "next/cache";
import { api, apiTags } from "@/utils/api";

export const setAllNotificationsAsShownAction = async (userId: string) => {
    await api.setAllNotificationsAsShown();
    revalidateTag(apiTags.getMyNotifications(userId));
};
