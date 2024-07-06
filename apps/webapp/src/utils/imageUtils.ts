import { PartialMessage } from "@bufbuild/protobuf";
import imageCompression from "browser-image-compression";
import { FastAverageColor } from "fast-average-color";
import { nanoid } from "nanoid/non-secure";
import qs from "query-string";
import { ListingItem, ListingItem_Data, ListingItem_Data_Image } from "targabay-protos/gen/ts/dist/types/common_pb";
import { GenerateSignedUrlRequest_Item } from "targabay-protos/gen/ts/dist/types/image_pb";
import * as ThumbHash from "thumbhash";
import { deleteObjectFromS3Action, getPresignedS3UrlsAction } from "@/actions/imageActions";
import { env } from "@/env.mjs";
import { getListingTitleFromListing, getLocationUserProfile, toSEOFriendlyTitleUrl } from "./helpers";
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
        } else if (item.name && item.url) {
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
        const compressedFiles: { file: File; key: string }[] = await Promise.all(
            filesToUpload.map(async (item) => ({
                file: await imageCompression(item.file as File, {
                    fileType: "image/webp",
                    initialQuality: 0.7,
                    maxWidthOrHeight: 1920,
                    maxSizeMB: 0.5,
                }),
                key: nanoid(),
            })),
        );

        const reqItems: PartialMessage<GenerateSignedUrlRequest_Item>[] = compressedFiles.map((item) => ({
            fileSize: `${item.file.size}`,
            fileType: item.file.type,
            fileKey: item.key,
        }));
        const presignedUrlRes = await getPresignedS3UrlsAction(reqItems);
        const uploadedUrls = await Promise.all(
            compressedFiles.map((item) => {
                const presignedRes = presignedUrlRes.items?.find((resItem) => item.key == resItem.key);
                if (!presignedRes) {
                    throw new Error("Failed to find presigned url for image");
                }
                return uploadToS3(item.file, presignedRes.url!, presignedRes.name, presignedRes?.bucket!, presignedRes?.region!);
            }),
        );

        compressedFiles.forEach((item, index) => {
            const fileToUpload = filesToUpload[index];
            const presignedRes = presignedUrlRes.items?.find((resItem) => item.key == resItem.key);
            const uploadedUrl = uploadedUrls[index];
            const colorAndHash = imageHashesAndColors[index];
            if (!colorAndHash || !uploadedUrl || !presignedRes || !fileToUpload) {
                throw new Error("Failed to find presigned url for image");
            }
            uploadedFiles.push({
                color: colorAndHash[1].hex,
                hash: colorAndHash[0],
                isThumbnail: fileToUpload.isThumbnail,
                name: presignedRes.name,
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

/** Replace the s3 URL of list of listings with CDN url */
export const transformListingsImages = (items: ListingItem[]) => items?.map((item) => replaceImageUrlWithCdn(item));

/** Replace the s3 URL with CDN url */
export const replaceImageUrlWithCdn = (item: ListingItem): ListingItem => {
    if (!env.IMAGE_CDN_BASE) {
        return item;
    }

    return {
        ...item,
        data: {
            ...item.data,
            vehicleImages: (item.data?.vehicleImages?.map((imageItem) => {
                const fileExtension = getFileExtension(imageItem.name);
                const location = getLocationUserProfile(item?.user!);
                const title = getListingTitleFromListing(item?.data!);
                const seoFriendlyName = toSEOFriendlyTitleUrl(title, location);
                return {
                    ...imageItem,
                    url: qs.stringifyUrl({
                        url: `${env.IMAGE_CDN_BASE}/ik-seo/${imageItem.name?.replace(fileExtension, "")}/${seoFriendlyName}${fileExtension}`,
                        query: { tr: "w-640", q: 75 },
                    }),
                };
            }) ?? []) as ListingItem_Data_Image[],
        } as ListingItem_Data,
    } as ListingItem;
};
