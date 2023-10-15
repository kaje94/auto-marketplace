"use server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { api, apiTags } from "@/utils/api";
import { UpdateProfileReq } from "@/utils/types";

export const editProfileAction = async (reqBody: UpdateProfileReq) => {
    await api.updateMyProfileDetails(reqBody);
    revalidateTag(apiTags.getMyProfileDetails(reqBody.userId));
};

export const closeUserAccountAction = async (userId: string) => {
    await api.closeUserAccount(userId);
    revalidateTag(apiTags.getMyProfileDetails(userId));
    redirect("/api/auth/logout");
};
