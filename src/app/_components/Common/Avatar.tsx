"use client";
import { UserIcon } from "@/icons";
import { generateInitialsFromName } from "@/utils/helpers";
import clsx from "clsx";
import Image from "next/image";
import React, { FC, useState } from "react";

interface Props {
    url: string;
    width: number;
    name?: string;
}

export const Avatar: FC<Props> = React.memo(({ url, width, name }) => {
    const [hasError, setHasError] = useState(false);
    return (
        <div className="relative flex items-center justify-center" style={{ width: width, height: width }}>
            <Image
                src={url}
                height={width}
                width={width}
                alt="profile-image"
                className="rounded-full bg-slate-600 object-cover"
                unoptimized
                // todo: check how to optimize user profile pics
                // also try and use the same size throughout //128
                // update in 3+ plages
                onError={() => setHasError(true)}
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
