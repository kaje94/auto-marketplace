"use server";
import { revalidateTag } from "next/cache";
import { api, apiTags } from "@/utils/api";

export const setAllNotificationsAsShownActions = async (userId: string) => {
    await api.setAllNotificationsAsShown();
    revalidateTag(apiTags.getMyNotifications(userId));
};
