"use client";
import { env } from "@/env.mjs";
import { convertToSEOFriendlyImageURL, thumbHashToDataUrl, toSEOFriendlyName } from "@/utils/helpers";
import { VehicleImageType } from "@/utils/types";
import Image, { ImageProps } from "next/image";
import { FC, useEffect, useState } from "react";
import qs from "query-string";

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
            src={image?.name!}
            loader={({ src, width, quality }) => convertToSEOFriendlyImageURL(src, seoFriendlyName, quality, width)}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            style={{ background: image?.averageColor }}
            {...rest}
        />
    );
};
