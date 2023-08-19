import { Vehicle, Location, ImageFile, ListingItem, VehicleCreate } from "./types";
import * as ThumbHash from "thumbhash";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { deleteObjectFromS3, getPresignedS3Url } from "@/app/_actions/imageActions";
import imageCompression from "browser-image-compression";

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

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

export const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const getFormattedCurrency = (amount: number, currency: string) =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency || "LKR",
        minimumFractionDigits: 0,
    }).format(amount || 0);

export const getListingTags = (location: Location, vehicle: Vehicle) => {
    return [location.city, unCamelCase(vehicle.condition), `${vehicle.millage} km`];
};

export const unCamelCase = (str: string = "") =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
        return str.toUpperCase();
    });

// todo: see if this can be moved to only a client side function
export const thumbHashToDataUrl = (thumbHash?: string) => {
    if (!thumbHash || thumbHash.length < 8) {
        return "";
    }
    try {
        const base64ToBinary = (base64: string) =>
            new Uint8Array(
                atob(base64)
                    .split("")
                    .map((x) => x.charCodeAt(0))
            );
        const thumbHashFromBase64 = base64ToBinary(thumbHash);
        const placeholderURL = ThumbHash.thumbHashToDataURL(thumbHashFromBase64);
        return placeholderURL;
    } catch {
        console.error("Failed to generate placeholder URL for ", thumbHash);
    }
};

export const transformImagesToPost = async (files: ImageFile[]): Promise<ImageFile[]> => {
    const images = await Promise.all(
        files.map(async (item) => {
            if (item.file && item.preview && !item.deleted) {
                const compressedFile = await imageCompression(item.file as File, {
                    fileType: "image/webp",
                    initialQuality: 0.7,
                    maxWidthOrHeight: 1920, // todo: also try 1280 size
                    maxSizeMB: 0.5,
                });
                const hash = await previewUrlToHash(item.preview);
                const { url, key, bucket, region } = await getPresignedS3Url(compressedFile.type, compressedFile?.length);
                const uploadedResp = await uploadToS3(compressedFile, url, key, bucket, region, item.preview);
                return { color: hash, isThumbnail: item.isThumbnail, name: key, url: uploadedResp.url };
            } else if (item.deleted && item.name && item.url) {
                await deleteObjectFromS3(item.name);
                return null;
            }
            return { color: item.color, isThumbnail: item.isThumbnail, name: item.name, url: item.url };
        })
    );
    return images.filter((item) => !!item?.url) as ImageFile[];
};

export const transformListingResponse = (itemDetails: ListingItem): ListingItem => {
    return {
        ...itemDetails,
        vehicle: {
            ...itemDetails.vehicle,
            vehicleImages: sortVehicleImages(
                itemDetails.vehicle.vehicleImages.map((imageItem) => ({
                    ...imageItem,
                    blurDataURL: thumbHashToDataUrl(imageItem.color),
                    deleted: false,
                }))
            ),
        },
    };
};

export const sortVehicleImages = (images: ImageFile[]) =>
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
