"use server";
import { api } from "@/utils/api";
import { GenerateS3SignedUrlReq } from "@/utils/types";

/** Get pre-signed urls needed to upload listing images */
export const getPresignedS3UrlsAction = async (fileList: { fileSize: number; filetype: string }[]) => {
    const req: GenerateS3SignedUrlReq = {
        imageMetaDatas: fileList.map((item) => ({
            fileSize: item.fileSize,
            fileType: item.filetype,
        })),
    };
    const response = await api.generateS3SignedUrls(req);

    return response;
};

/** Delete listing images during the listing update flow */
export const deleteObjectFromS3Action = async (imageKeys: string[]) => {
    await api.deleteS3Image({ keys: imageKeys });
};
