"use server";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { nanoid } from "nanoid/non-secure";
import { api } from "@/utils/api";
import { GenerateS3SignedUrlReq } from "@/utils/types";

export const getPresignedS3UrlsAction = async (fileList: { fileSize: number; filetype: string }[]) => {
    const session = await getSession();

    const req: GenerateS3SignedUrlReq = {
        imageMetaDatas: fileList.map((item) => ({
            fileSize: item.fileSize,
            fileType: item.filetype,
            key: `images/${session?.user?.sub?.replace("|", "-")}/${nanoid()}.webp`,
        })),
    };
    const response = await api.generateS3SignedUrls(req);

    return response;
};

export const deleteObjectFromS3Action = async (imageKeys: string[]) => {
    const session = await getSession();
    if (!session?.user) {
        throw new Error("User session not found to delete image");
    }
    if (!imageKeys.every((item) => item.includes(session?.user?.sub?.replace("|", "-")))) {
        throw new Error("User cannot delete this image");
    }

    await Promise.all(imageKeys.map((item) => api.deleteS3Image({ keys: imageKeys })));
};
