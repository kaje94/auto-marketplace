"use client";
import { env } from "@/env.mjs";
import { thumbHashToDataUrl } from "@/utils/helpers";
import { VehicleImageType } from "@/utils/types";
import Image, { ImageProps } from "next/image";
import { FC, useEffect, useState } from "react";

const convertToSEOFriendlyImageURL = (src: string, seoFriendlyName: string, width: number, quality: number = 75): string => {
    const fileExtension = getFileExtension(src);
    return `${env.NEXT_PUBLIC_IMAGE_CDN_BASE}/ik-seo${src?.replace(fileExtension, "")}/${seoFriendlyName}${fileExtension}?tr=w-${width}&q=${quality}`;
};

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

const toSEOFriendlyName = (originalName: string): string => {
    // Convert to lowercase
    let seoName = originalName.toLowerCase();

    // Replace spaces with dashes
    seoName = seoName.replace(/\s+/g, "-");

    // Remove special characters and symbols
    seoName = seoName.replace(/[^\w\-]+/g, "");

    return seoName;
};

interface Props extends Omit<ImageProps, "src" | "alt"> {
    title: string;
    image?: VehicleImageType;
}

export const ListingImage: FC<Props> = ({ image, width, title, ...rest }) => {
    const [blurDataURL, setBlurDataURL] = useState<string | undefined>("");

    useEffect(() => setBlurDataURL(thumbHashToDataUrl(image?.thumbHash)), [image]);

    const seoFriendlyName = toSEOFriendlyName(title);

    return (
        <Image
            priority={false}
            width={width}
            alt={seoFriendlyName}
            src={image?.name?.replace("images", "")!}
            loader={({ src, width, quality }) => convertToSEOFriendlyImageURL(src, seoFriendlyName, width, quality)}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            style={{ background: image?.averageColor }}
            {...rest}
        />
    );
};
