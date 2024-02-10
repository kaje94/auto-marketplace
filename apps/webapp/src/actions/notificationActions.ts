"use server";
import { revalidateTag } from "next/cache";
import { api, apiTags } from "@/utils/api";

/** Mark all notifications as read */
export const setAllNotificationsAsShownAction = async (userId: string) => {
    await api.setAllNotificationsAsShown();
    revalidateTag(apiTags.getMyNotifications(userId));
};
