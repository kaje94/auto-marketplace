"use client";
import { clsx } from "clsx";
import Image from "next/image";
import React, { FC, memo, useState } from "react";
import { UserIcon } from "@/icons";

interface Props {
    /** Indicates whether the data for the avatar is currently loading. */
    loading?: boolean;
    /** The name of the user which will be used as a fallback if image load fails */
    name?: string;
    /** The URL of the avatar image. */
    url?: string;
    /** The width of the avatar. The height will be the same as width */
    width: number;
}

/** Avatar component to represent user's profile picture in navbar as well as in listings */
export const Avatar: FC<Props> = memo(({ url, width, name, loading }) => {
    const [hasError, setHasError] = useState(false);
    return (
        <div
            className={clsx(
                "relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-neutral-600",
                loading && "bg-opacity-50",
            )}
        >
            {url && (
                <Image
                    alt="profile-image"
                    className="rounded-full bg-slate-600 object-cover"
                    data-testid="profile-image"
                    height={width}
                    referrerPolicy="no-referrer"
                    src={url}
                    width={width}
                    unoptimized
                    onError={() => setHasError(true)}
                />
            )}

            <div className={clsx("avatar placeholder absolute inset-0 h-full w-full overflow-hidden", hasError || !url ? "block" : "hidden")}>
                <div className={clsx("h-full w-full rounded-full bg-neutral-800 text-neutral-content", loading && "animate-pulse bg-opacity-20")}>
                    {name ? (
                        <span style={{ fontSize: width * 0.45 }}>{generateInitialsFromName(name)}</span>
                    ) : (
                        <UserIcon style={{ width: width * 0.6, height: width * 0.6 }} />
                    )}
                </div>
            </div>
        </div>
    );
});
Avatar.displayName = "Avatar";

const generateInitialsFromName = (name?: string): string => {
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
