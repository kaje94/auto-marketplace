"use client";
import { env } from "@/env.mjs";
import { thumbHashToDataUrl } from "@/utils/helpers";
import { VehicleImageType } from "@/utils/types";
import Image, { ImageProps } from "next/image";
import { FC, useEffect, useState } from "react";

interface Props extends Omit<ImageProps, "src"> {
    image?: VehicleImageType;
}

export const ListingImage: FC<Props> = ({ image, alt, width, ...rest }) => {
    const [blurDataURL, setBlurDataURL] = useState<string | undefined>("");

    useEffect(() => setBlurDataURL(thumbHashToDataUrl(image?.thumbHash)), [image]);

    return (
        <Image
            priority={false}
            width={width}
            alt={alt}
            src={image?.name?.replace("images", "")!}
            loader={({ src, width, quality }) => `${env.NEXT_PUBLIC_IMAGE_CDN_BASE}${src}?tr=w-${width}&q=${quality || 75}`}
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            style={{ background: image?.averageColor }}
            {...rest}
        />
    );
};
