import imageCompression from "browser-image-compression";
import { FastAverageColor } from "fast-average-color";
import qs from "query-string";
import * as ThumbHash from "thumbhash";
import { deleteObjectFromS3Action, getPresignedS3UrlsAction } from "@/actions/imageActions";
import { env } from "@/env.mjs";
import { VehicleImageType } from "./types";

/**
 * To be used when handling images within listing form.
 * - Deletes images that needs to be removed during listing update
 * - For new images
 * -- Generate thumb hash
 * -- Get color of the image
 * -- Compress the image into a smaller webp file
 * -- Generate pre-signed URL for the image
 * -- Upload image to S3
 */
export const transformImagesToPost = async (files: VehicleImageType[]): Promise<VehicleImageType[]> => {
    const filesToUpload: VehicleImageType[] = [];
    const filesToDelete: VehicleImageType[] = [];
    const existingFiles: VehicleImageType[] = [];
    const uploadedFiles: VehicleImageType[] = [];

    files.forEach((item) => {
        if (item.file && item.preview && !item.deleted) {
            filesToUpload.push(item);
        } else if (item.deleted && item.name && item.url) {
            filesToDelete.push(item);
        } else {
            existingFiles.push({ color: item.color, hash: item.hash, isThumbnail: item.isThumbnail, name: item.name, url: item.url });
        }
    });

    if (filesToDelete.length > 0) {
        await deleteObjectFromS3Action(filesToDelete.map((item) => item.name!));
    }
    if (filesToUpload.length > 0) {
        const fac = new FastAverageColor();
        const imageHashesAndColors = await Promise.all(
            filesToUpload.map((item) => Promise.all([previewUrlToHash(item.preview!), fac.getColorAsync(item.preview!)])),
        );
        const compressedFiles: File[] = await Promise.all(
            filesToUpload.map((item) =>
                imageCompression(item.file as File, {
                    fileType: "image/webp",
                    initialQuality: 0.7,
                    maxWidthOrHeight: 1920,
                    maxSizeMB: 0.5,
                }),
            ),
        );
        const presignedUrlRes = await getPresignedS3UrlsAction(compressedFiles.map((item) => ({ fileSize: item.length, filetype: item.type })));
        const uploadedUrls = await Promise.all(
            compressedFiles.map((item, index) => {
                const presignedRes = presignedUrlRes[index];
                if (!presignedRes) {
                    throw new Error("Failed to find presigned url for image");
                }
                return uploadToS3(item, presignedRes.url!, presignedRes.key, presignedRes?.bucket!, presignedRes?.region!);
            }),
        );

        compressedFiles.forEach((_item, index) => {
            const fileToUpload = filesToUpload[index];
            const presignedRes = presignedUrlRes[index];
            const uploadedUrl = uploadedUrls[index];
            const colorAndHash = imageHashesAndColors[index];
            if (!colorAndHash || !uploadedUrl || !presignedRes || !fileToUpload) {
                throw new Error("Failed to find presigned url for image");
            }
            uploadedFiles.push({
                color: colorAndHash[1].hex,
                hash: colorAndHash[0],
                isThumbnail: fileToUpload.isThumbnail,
                name: presignedRes.key,
                url: uploadedUrl.url,
            });
        });
    }
    return [...existingFiles, ...uploadedFiles];
};

/** Upload image to S3 using pre-signed URL */
const uploadToS3 = async (file: File, url: string, key: string, bucket: string, region: string) => {
    const buffer = await file.arrayBuffer();

    await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.setRequestHeader("Cache-Control", "max-age=630720000");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve();
                } else {
                    reject();
                }
            }
        };

        xhr.send(buffer);
    });

    const resultUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return { url: resultUrl };
};

/** Generate preview image from thumb hash. Only works in the client side */
const previewUrlToHash = async (previewUrl: string) => {
    // Only works in client side due to window.btoa
    let thumbHash = "";
    const image = new Image();
    image.src = previewUrl;
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement("canvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    const scale = 100 / Math.max(image.width, image.height);
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);
    if (context) {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
        const binaryThumbHash = ThumbHash.rgbaToThumbHash(pixels.width, pixels.height, pixels.data);

        const binaryToBase64 = (binary: any) => window.btoa(String.fromCharCode(...binary));

        thumbHash = binaryToBase64(binaryThumbHash);
    }
    canvas.remove();
    return thumbHash;
};

/** Generate SEO friendly listing image URL */
export const convertToSEOFriendlyImageURL = (src: string, seoFriendlyName: string, quality: number = 75, width: number = 640): string => {
    const fileExtension = getFileExtension(src);
    return `${env.NEXT_PUBLIC_IMAGE_CDN_BASE}/ik-seo/${src?.replace(fileExtension, "")}/${seoFriendlyName}${fileExtension}?${qs.stringify({
        tr: width ? `w-${width}` : undefined,
        q: quality,
    })}`;
};

/** Get file extension of the image file */
const getFileExtension = (filePath: string): string => {
    // Use the split method to separate the path into segments
    const segments = filePath.split("/");

    // Get the last segment (file name)
    const fileName = segments[segments.length - 1];

    if (fileName) {
        // Use the split method again to separate the file name from its extension
        const fileNameSegments = fileName.split(".");

        // Check if there's a valid file extension
        if (fileNameSegments.length > 1) {
            // Return the last segment (the file extension)
            return fileNameSegments[fileNameSegments.length - 1] ? `.${fileNameSegments[fileNameSegments.length - 1]}` : "";
        }
    }
    // If there's no valid file extension, return null or an appropriate default value
    return "";
};
