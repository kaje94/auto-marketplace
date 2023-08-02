import { ShareIcon, CopyIcon, FacebookIcon, TwitterIcon } from "@/icons";
import clsx from "clsx";
import { FC } from "react";

interface Props {
    loading?: boolean;
}

export const ShareButton: FC<Props> = ({ loading }) => (
    <div className="dropdown-top dropdown-end dropdown">
        <button tabIndex={0} className={clsx("!btn-block btn gap-2", loading && "animate-pulse")} disabled={loading}>
            <ShareIcon />
            Share
        </button>
        <ul tabIndex={0} className="dropdown-content menu rounded-box  mb-2 w-11/12 bg-base-100 p-2 shadow-2xl">
            <li className="flex cursor-pointer rounded-lg duration-200 hover:bg-base-200">
                <button>
                    <CopyIcon /> Copy Link
                </button>
            </li>
            <li>
                <a>
                    <FacebookIcon /> Share in Facebook
                </a>
            </li>
            <li>
                <a>
                    <TwitterIcon /> Share in Twitter
                </a>
            </li>
        </ul>
    </div>
);
