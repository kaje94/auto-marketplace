"use client";
import Image, { ImageProps } from "next/image";
import qs from "query-string";
import { FC, useEffect, useState } from "react";
import * as ThumbHash from "thumbhash";
import { AlertCircleIcon } from "@/icons";
import { toSEOFriendlyTitleUrl } from "@/utils/helpers";
import { Location, VehicleImageType } from "@/utils/types";

interface Props extends Omit<ImageProps, "src" | "alt"> {
    /** Properties of a listing image such as URL, color, hash, etc */
    image?: VehicleImageType;
    /** Location details of the listing will be used for SEO */
    location: Location;
    /** Show error if unable to load image */
    showHasError?: boolean;
    /** Title of the listing will also be used for SEO */
    title: string;
}

/**
 * Component that will load uploaded listing images via a CDN.
 * This component will also handle image load failures and show an error icon.
 * A placeholder image will also be displayed while the actual image is loaded.
 */
export const ListingImage: FC<Props> = ({ image, width = 640, quality = 75, title, location, showHasError = true, ...rest }) => {
    const [blurDataURL, setBlurDataURL] = useState<string | undefined>("");
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        if (image?.hash) {
            setBlurDataURL(thumbHashToDataUrl(image?.hash));
        }
    }, [image]);

    const seoFriendlyName = toSEOFriendlyTitleUrl(title, location);

    return (
        <span className="relative flex h-full w-full items-center justify-center">
            <Image
                alt={seoFriendlyName}
                loader={({ src }) => qs.stringifyUrl({ url: src, query: { tr: `w-${width}`, q: quality } })}
                placeholder={(blurDataURL as `data:image/${string}`) || "empty"}
                priority={false}
                quality={quality}
                src={hasError && blurDataURL ? blurDataURL : image?.url!}
                style={{ backgroundColor: image?.color }}
                width={width}
                onError={() => setHasError(true)}
                {...rest}
            />
            {hasError && showHasError && (
                <div className="absolute flex flex-col items-center justify-center gap-2 opacity-75">
                    <AlertCircleIcon height={(width as number) * 0.2} width={(width as number) * 0.2} />
                    <span className="font-semibold" style={{ fontSize: (width as number) * 0.05 }}>
                        Image Unavailable
                    </span>
                </div>
            )}
        </span>
    );
};

const thumbHashToDataUrl = (thumbHash?: string) => {
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
