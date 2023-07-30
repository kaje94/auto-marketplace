"use server";
import { authOptions } from "@/auth/authConfig";
import { env } from "@/env.mjs";
import { S3Client, PutObjectCommandInput, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth/next";

const client = new S3Client({
    credentials: { accessKeyId: env.S3_UPLOAD_KEY, secretAccessKey: env.S3_UPLOAD_SECRET },
    region: env.S3_UPLOAD_REGION,
});

export const getPresignedS3Url = async (filetype: string, fileSize: number) => {
    const bucket = env.S3_UPLOAD_BUCKET;
    const region = env.S3_UPLOAD_REGION;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("User session not found to generate S3 presigned URL");
    }
    let key = `images/${session?.user?.id}/${nanoid()}.webp`;

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
