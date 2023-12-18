"use client";
import Image, { ImageProps } from "next/image";
import { FC, useEffect, useState } from "react";
import { convertToSEOFriendlyImageURL, thumbHashToDataUrl, toSEOFriendlyTitleUrl } from "@/utils/helpers";
import { Location, VehicleImageType } from "@/utils/types";

interface Props extends Omit<ImageProps, "src" | "alt"> {
    image?: VehicleImageType;
    location: Location;
    title: string;
}

export const ListingImage: FC<Props> = ({ image, width, title, location, ...rest }) => {
    const [blurDataURL, setBlurDataURL] = useState<string | undefined>("");

    useEffect(() => {
        if (image?.hash) {
            setBlurDataURL(thumbHashToDataUrl(image?.hash));
        }
    }, [image]);

    const seoFriendlyName = toSEOFriendlyTitleUrl(title, location);

    return (
        <Image
            alt={seoFriendlyName}
            loader={({ src, width, quality }) => convertToSEOFriendlyImageURL(src, seoFriendlyName, quality, width)}
            placeholder={(blurDataURL as `data:image/${string}`) || "empty"}
            priority={false}
            src={image?.name!}
            style={{ background: image?.color }}
            width={width}
            {...rest}
        />
    );
};
