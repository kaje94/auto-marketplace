"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { api, apiTags } from "@/utils/api";
import { UpdateProfileReq } from "@/utils/types";

/** Edit profile details of logged in user */
export const editProfileAction = async (reqBody: UpdateProfileReq) => {
    await api.updateMyProfileDetails(reqBody);
    revalidateTag(apiTags.getMyProfileDetails(reqBody.userId));
};

/** Close user account of the logged in user */
export const closeUserAccountAction = async (userId: string) => {
    await api.closeUserAccount(userId);
    revalidateTag(apiTags.getMyProfileDetails(userId));
    redirect("/api/auth/logout");
};
