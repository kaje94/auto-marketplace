"use client";
import { ShareIcon, CopyIcon, FacebookIcon, TwitterIcon } from "@/icons";
import clsx from "clsx";
import queryString from "query-string";
import { FC, useMemo } from "react";
import toast from "react-hot-toast";

interface Props {
    loading?: boolean;
    title?: string;
}

export const ShareButton: FC<Props> = ({ loading, title }) => {
    const popupWindowFeatures = useMemo(() => {
        const popupWidth = 900;
        const popupHeight = 600;
        const left = window.innerWidth / 2 - popupWidth / 2;
        const top = window.innerHeight / 2 - popupHeight / 2;

        return `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`;
    }, []);

    return (
        <div className="dropdown-top dropdown-end dropdown">
            <button tabIndex={0} className={clsx("!btn-block btn gap-2", loading && "animate-pulse")} disabled={loading}>
                <ShareIcon />
                Share
            </button>
            <ul tabIndex={0} className="dropdown-content menu rounded-box  mb-2 w-11/12 bg-base-100 p-2 shadow-2xl">
                <li className="flex cursor-pointer rounded-lg duration-200 hover:bg-base-200">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window?.location?.href);
                            toast.success("Link successfully copied to clipboard");
                        }}
                    >
                        <CopyIcon /> Copy Link
                    </button>
                </li>
                <li className="flex cursor-pointer rounded-lg duration-200 hover:bg-base-200">
                    <button
                        onClick={() => {
                            const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${window?.location?.href}`;
                            window?.open(facebookShareUrl, "Share on Facebook", popupWindowFeatures);
                        }}
                    >
                        <FacebookIcon /> Share on Facebook
                    </button>
                </li>
                <li className="flex cursor-pointer rounded-lg duration-200 hover:bg-base-200">
                    <button
                        onClick={() => {
                            const twitterShareUrl = `https://twitter.com/intent/tweet?${queryString.stringify({
                                text: title ?? "Vehicle for Sales",
                                url: window?.location?.href,
                            })}`;
                            window?.open(twitterShareUrl, "Share on Twitter", popupWindowFeatures);
                        }}
                    >
                        <TwitterIcon /> Share on Twitter
                    </button>
                </li>
            </ul>
        </div>
    );
};
