import imageCompression from "browser-image-compression";
import { FastAverageColor } from "fast-average-color";
import { ReadonlyURLSearchParams } from "next/navigation";
import qs from "query-string";
import * as ThumbHash from "thumbhash";
import { deleteObjectFromS3Action, getPresignedS3UrlAction } from "@/actions/imageActions";
import { env } from "@/env.mjs";
import { ListingItem, ListingItems, ListingUser, Location, PaginatedResponse, Vehicle, VehicleCreate, VehicleImageType } from "./types";

export const convertYearToDateString = (year: string | number): string => {
    const yearNumber = typeof year === "string" ? parseInt(year, 10) : year;

    if (isNaN(yearNumber) || yearNumber < 1000) {
        return "";
    }

    // Assuming January 1st of the given year
    const date = new Date(yearNumber, 0, 1);

    // // Get the year, month, and day from the date object
    const yyyy = date.getFullYear().toString().padStart(4, "0");
    const mm = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");

    // Format the date as yyyy-mm-dd
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    return formattedDate;
};

export const getListingTitleFromVehicle = (vehicle: Vehicle | VehicleCreate) => {
    if (vehicle.trim) {
        return `${vehicle.brand} ${vehicle.model} ${vehicle.trim} ${vehicle.yearOfManufacture}`;
    }
    return `${vehicle.brand} ${vehicle.model} ${vehicle.yearOfManufacture}`;
};

export const getYearFromDateString = (dateStr: string) => {
    return new Date(dateStr).getFullYear();
};

export const uploadToS3 = async (file: File, url: string, key: string, bucket: string, region: string, previewUrl: string) => {
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

export const numberWithCommas = (x: number | string) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getFormattedCurrency = (amount: number | string = 0, currency: string) => `${currency} ${numberWithCommas(amount)}`;

export const getFormattedDistance = (distance: number | string, countryCode: string | undefined) =>
    `${numberWithCommas(distance)} ${getDistanceUnit(countryCode)}`;

export const unCamelCase = (str: string = "") => {
    if (typeof str === "string") {
        return str
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, function (str) {
                return str.toUpperCase();
            })
            ?.trim();
    }
    return str;
};

export const thumbHashToDataUrl = (thumbHash?: string) => {
    if (!thumbHash || thumbHash.length < 8) {
        return "";
    }
    try {
        const base64ToBinary = (base64: string) =>
            new Uint8Array(
                window
                    .atob(base64)
                    .split("")
                    .map((x) => x.charCodeAt(0)),
            );
        const thumbHashFromBase64 = base64ToBinary(thumbHash);
        const placeholderURL = ThumbHash.thumbHashToDataURL(thumbHashFromBase64);
        return placeholderURL;
    } catch {
        console.error("Failed to generate placeholder URL for ", thumbHash);
    }
};

export const transformImagesToPost = async (files: VehicleImageType[]): Promise<VehicleImageType[]> => {
    const images = await Promise.all(
        files.map(async (item) => {
            if (item.file && item.preview && !item.deleted) {
                const fac = new FastAverageColor();
                const compressedFile = await imageCompression(item.file as File, {
                    fileType: "image/webp",
                    initialQuality: 0.7,
                    maxWidthOrHeight: 1920,
                    maxSizeMB: 0.5,
                });
                const [hash, { url, key, bucket, region }, color] = await Promise.all([
                    previewUrlToHash(item.preview),
                    getPresignedS3UrlAction(compressedFile.type, compressedFile?.length),
                    fac.getColorAsync(item.preview),
                ]);
                const uploadedResp = await uploadToS3(compressedFile, url, key, bucket, region, item.preview);

                return { color: `${color.hex}_${hash}`, isThumbnail: item.isThumbnail, name: key, url: uploadedResp.url };
            } else if (item.deleted && item.name && item.url) {
                await deleteObjectFromS3Action(item.name);
                return null;
            }
            return { color: item.color, isThumbnail: item.isThumbnail, name: item.name, url: item.url };
        }),
    );
    return images.filter((item) => !!item?.url) as VehicleImageType[];
};

export const transformListingsListResponse = (listings: PaginatedResponse & ListingItems): PaginatedResponse & ListingItems => {
    return { ...listings, items: listings.items.map((item) => transformListingResponse(item)) };
};

export const transformListingResponse = (itemDetails: ListingItem): ListingItem => {
    return {
        ...itemDetails,
        vehicle: {
            ...itemDetails.vehicle,
            vehicleImages: sortVehicleImages(
                itemDetails.vehicle.vehicleImages.map((imageItem) => ({
                    ...imageItem,
                    averageColor: imageItem?.color?.includes("_") ? imageItem?.color.split("_")[0] : "",
                    thumbHash: imageItem?.color?.includes("_") ? imageItem?.color.split("_")[1] : imageItem?.color,
                    deleted: false,
                })),
            ),
        },
    };
};

export const sortVehicleImages = (images: VehicleImageType[]) =>
    images.sort((a, b) => {
        if (a.isThumbnail && !b.isThumbnail) {
            return -1; // a comes before b in the sorted order
        } else if (!a.isThumbnail && b.isThumbnail) {
            return 1; // b comes before a in the sorted order
        }
        return 0; // no change in order, both have the same value of "isThumbnail"
    });

export const previewUrlToHash = async (previewUrl: string) => {
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

export const getLocationString = (location?: Location, countryName?: string) => {
    const itemsArr = [];
    if (location?.city) {
        itemsArr.push(location.city);
    }
    if (location?.state) {
        itemsArr.push(location.state);
    }
    if (countryName) {
        itemsArr.push(countryName);
    } else if (location?.country) {
        itemsArr.push(location?.country);
    }
    return itemsArr.join(", ");
};

export function getRandomItem<T>(items: T[]): T | undefined {
    return items[Math.floor(Math.random() * items.length)];
}

export const timeAgo = (date: Date): string => {
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - date.getTime();
    const minutesAgo = Math.floor(timeDifference / (1000 * 60));
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
    const weeksAgo = Math.floor(daysAgo / 7);
    const monthsAgo = Math.floor(currentDate.getMonth() - date.getMonth() + 12 * (currentDate.getFullYear() - date.getFullYear()));
    const yearsAgo = Math.floor(currentDate.getFullYear() - date.getFullYear());

    if (minutesAgo < 1) {
        return "just now";
    } else if (minutesAgo < 60) {
        return minutesAgo === 1 ? "1 minute ago" : `${minutesAgo} minutes ago`;
    } else if (hoursAgo < 24) {
        return hoursAgo === 1 ? "1 hour ago" : `${hoursAgo} hours ago`;
    } else if (daysAgo < 7) {
        return daysAgo === 1 ? "1 day ago" : `${daysAgo} days ago`;
    } else if (weeksAgo < 4) {
        return weeksAgo === 1 ? "1 week ago" : `${weeksAgo} weeks ago`;
    } else if (monthsAgo < 12) {
        return monthsAgo === 1 ? "1 month ago" : `${monthsAgo} months ago`;
    } else {
        return yearsAgo === 1 ? "1 year ago" : `${yearsAgo} years ago`;
    }
};

export const getRandomNumber = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

export const generateInitialsFromName = (name?: string): string => {
    if (!name) {
        return "";
    }
    // Split the name into words using spaces and periods as delimiters
    const words = name.split(/[\s.]+/);

    // Initialize an empty string to store the initials
    let initials = "";

    // Iterate through the words and add the first character of each word to the initials
    for (const word of words) {
        if (initials.length < 2 && word.length > 0 && word[0]?.toUpperCase()) {
            initials += word[0]?.toUpperCase();
        }
    }

    // Return the generated initials (up to 2 characters)
    return initials;
};

export const convertToSEOFriendlyImageURL = (src: string, seoFriendlyName: string, quality: number = 75, width?: number): string => {
    const fileExtension = getFileExtension(src);
    return `${env.NEXT_PUBLIC_IMAGE_CDN_BASE}/ik-seo/${src?.replace(fileExtension, "")}/${seoFriendlyName}${fileExtension}?${qs.stringify({
        tr: width ? `w-${width}` : undefined,
        q: quality,
    })}`;
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

export const toSEOFriendlyName = (originalName: string, location?: Location): string => {
    const seoName = originalName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");

    const locationStr = getLocationString(location)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "");

    return `${seoName}-for-sale${locationStr ? `-in-${locationStr}` : ""}`;
};

export const isIncompleteUserProfile = (profile: ListingUser) =>
    !profile.phone || !profile.address?.city || !profile.address?.state || !profile.address?.country || !profile.address?.postalCode;

export const getDistanceUnit = (countryCode: string | undefined) => (countryCode === "US" ? "mi" : "km");
