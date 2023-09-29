"use client";
import Image, { ImageProps } from "next/image";
import { FC, useEffect, useState } from "react";
import { convertToSEOFriendlyImageURL, thumbHashToDataUrl, toSEOFriendlyName } from "@/utils/helpers";
import { Location, VehicleImageType } from "@/utils/types";

interface Props extends Omit<ImageProps, "src" | "alt"> {
    title: string;
    location: Location;
    image?: VehicleImageType;
}

export const ListingImage: FC<Props> = ({ image, width, title, location, ...rest }) => {
    const [blurDataURL, setBlurDataURL] = useState<string | undefined>("");

    useEffect(() => setBlurDataURL(thumbHashToDataUrl(image?.thumbHash)), [image]);

    const seoFriendlyName = toSEOFriendlyName(title, location);

    return (
        <Image
            alt={seoFriendlyName}
            blurDataURL={blurDataURL}
            loader={({ src, width, quality }) => convertToSEOFriendlyImageURL(src, seoFriendlyName, quality, width)}
            placeholder={blurDataURL ? "blur" : "empty"}
            priority={false}
            src={image?.name!}
            style={{ background: image?.averageColor }}
            width={width}
            {...rest}
        />
    );
};
