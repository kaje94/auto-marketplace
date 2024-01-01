"use client";
import { clsx } from "clsx";
import queryString from "query-string";
import { FC } from "react";
import { toast } from "react-hot-toast";
import { CopyIcon, FacebookIcon, ShareIcon, TwitterIcon } from "@/icons";

interface Props {
    loading?: boolean;
    title?: string;
}

export const ShareButton: FC<Props> = ({ loading, title }) => {
    const popupWindowFeatures = () => {
        const popupWidth = 900;
        const popupHeight = 600;
        const left = typeof window === undefined ? 0 : window?.innerWidth / 2 - popupWidth / 2;
        const top = typeof window === undefined ? 0 : window?.innerHeight / 2 - popupHeight / 2;

        return `width=${popupWidth},height=${popupHeight},left=${left},top=${top}`;
    };

    return (
        <div className="dropdown dropdown-end dropdown-top">
            <button className={clsx("btn !btn-block gap-2", loading && "animate-pulse")} disabled={loading} tabIndex={0}>
                <ShareIcon />
                Share
            </button>
            <ul
                className="menu dropdown-content rounded-box mb-2 w-11/12 rounded-br-none border-2 border-base-200 bg-base-100 p-2 shadow-xl"
                tabIndex={0}
            >
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
                            window?.open(facebookShareUrl, "Share on Facebook", popupWindowFeatures());
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
                            window?.open(twitterShareUrl, "Share on Twitter", popupWindowFeatures());
                        }}
                    >
                        <TwitterIcon /> Share on Twitter
                    </button>
                </li>
            </ul>
        </div>
    );
};
