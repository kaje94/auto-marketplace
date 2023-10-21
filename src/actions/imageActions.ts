"use server";
import { getSession } from "@auth0/nextjs-auth0";
import { DeleteObjectCommand, DeleteObjectCommandInput, PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid/non-secure";
import { env } from "@/env.mjs";

const client = new S3Client({
    credentials: { accessKeyId: env.S3_UPLOAD_KEY, secretAccessKey: env.S3_UPLOAD_SECRET },
    region: env.S3_UPLOAD_REGION,
});

export const getPresignedS3UrlAction = async (filetype: string, fileSize: number) => {
    const bucket = env.S3_UPLOAD_BUCKET;
    const region = env.S3_UPLOAD_REGION;
    const session = await getSession();
    if (!session?.user) {
        throw new Error("User session not found to generate S3 presigned URL");
    }
    let key = `images/${session?.user?.sub?.replace("|", "-")}/${nanoid()}.webp`;

    const params: PutObjectCommandInput = {
        Bucket: env.S3_UPLOAD_BUCKET,
        Key: key,
        ContentType: filetype,
        CacheControl: "max-age=630720000",
        ContentLength: fileSize,
    };

    const url = await getSignedUrl(client, new PutObjectCommand(params), { expiresIn: 60 });

    return { url, key, bucket, region };
};

export const deleteObjectFromS3Action = async (imageKey: string) => {
    const session = await getSession();
    if (!session?.user) {
        throw new Error("User session not found to delete image");
    }
    if (!imageKey.includes(session?.user?.sub?.replace("|", "-"))) {
        throw new Error("User cannot delete this image");
    }

    const params: DeleteObjectCommandInput = { Bucket: env.S3_UPLOAD_BUCKET, Key: imageKey };
    await client.send(new DeleteObjectCommand(params));
};
