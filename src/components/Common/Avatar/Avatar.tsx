"use client";
import { clsx } from "clsx";
import Image from "next/image";
import React, { FC, memo, useState } from "react";
import { UserIcon } from "@/icons";
import { generateInitialsFromName } from "@/utils/helpers";

interface Props {
    name?: string;
    url: string;
    width: number;
}

export const Avatar: FC<Props> = memo(({ url, width, name }) => {
    const [hasError, setHasError] = useState(false);
    return (
        <div className="relative flex items-center justify-center" style={{ width: width, height: width }}>
            <Image
                alt="profile-image"
                className="rounded-full bg-slate-600 object-cover"
                height={width}
                onError={() => setHasError(true)}
                referrerPolicy="no-referrer"
                src={url}
                unoptimized
                width={width}
            />
            <div className={clsx("placeholder avatar absolute inset-0", hasError ? "block" : "hidden")}>
                <div className="h-full w-full rounded-full bg-neutral-800  text-neutral-content">
                    {name ? (
                        <span className="text-xl">{generateInitialsFromName(name)}</span>
                    ) : (
                        <UserIcon style={{ width: width * 0.6, height: width * 0.6 }} />
                    )}
                </div>
            </div>
        </div>
    );
});
Avatar.displayName = "Avatar";
