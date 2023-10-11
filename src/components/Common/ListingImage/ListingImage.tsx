"use client";
import Image, { ImageProps } from "next/image";
import { FC, useEffect, useState } from "react";
import { convertToSEOFriendlyImageURL, thumbHashToDataUrl, toSEOFriendlyName } from "@/utils/helpers";
import { Location, VehicleImageType } from "@/utils/types";

interface Props extends Omit<ImageProps, "src" | "alt"> {
    image?: VehicleImageType;
    location: Location;
    title: string;
}

export const ListingImage: FC<Props> = ({ image, width, title, location, ...rest }) => {
    const [blurDataURL, setBlurDataURL] = useState<string | undefined>("");

    useEffect(() => {
        // todo: remove this error throwing
        if (!image?.thumbHash) {
            throw new Error("image?.thumbHash is empty");
        }
        setBlurDataURL(thumbHashToDataUrl(image?.thumbHash));
    }, [image]);

    const seoFriendlyName = toSEOFriendlyName(title, location);

    return (
        <Image
            alt={seoFriendlyName}
            loader={({ src, width, quality }) => convertToSEOFriendlyImageURL(src, seoFriendlyName, quality, width)}
            placeholder={(blurDataURL as `data:image/${string}`) || "empty"}
            priority={false}
            src={image?.name!}
            style={{ background: image?.averageColor }}
            width={width}
            {...rest}
        />
    );
};
