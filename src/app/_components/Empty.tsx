import { LayersIcon } from "@/icons";
import clsx from "clsx";
import Link from "next/link";
import { FC } from "react";

interface Props {
    iconSize?: "sm" | "lg";
    text?: string;
    subText?: string;
    button?: {
        text: string;
        href: string;
        onClick: () => void;
        loading?: boolean;
    };
}

export const Empty: FC<Props> = ({ iconSize = "lg", button, text = "Nothing to display", subText = "" }) => (
    <div className="col-span-full flex h-full w-full flex-col items-center justify-center gap-2 p-10 opacity-50">
        <LayersIcon className={clsx({ "text-base-300": true, "h-52 w-52": iconSize === "lg", "h-24 w-24": iconSize === "sm" })} strokeWidth={2} />
        <h6 className="text-center text-2xl font-bold">{text}</h6>
        <p className="max-w-sm text-center text-base">{subText}</p>
        {button && (
            <>
                {button.loading ? (
                    <button className="btn-ghost btn-outline btn-wide btn mt-6" disabled>
                        {button?.text}
                    </button>
                ) : (
                    <Link href={button.href} className="btn-ghost btn-outline btn-wide btn mt-6" onClick={button.onClick}>
                        {button?.text}
                    </Link>
                )}
            </>
        )}
    </div>
);
