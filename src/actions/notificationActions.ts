"use server";
import { api, apiTags } from "@/utils/api";
import { revalidateTag } from "next/cache";

export const setAllNotificationsAsShownActions = async (userId: string) => {
    await api.setAllNotificationsAsShown();
    revalidateTag(apiTags.getMyNotifications(userId));
};
