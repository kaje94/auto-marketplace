import { clsx } from "clsx";
import { FC } from "react";
import { LayersIcon } from "@/icons";
import { LinkWithLocale } from "../LinkWithLocale";

interface EmptyProps {
    button?: {
        href: string;
        loading?: boolean;
        onClick?: () => void;
        text: string;
    };
    iconSize?: "sm" | "lg";
    subText?: string;
    text?: string;
}

export const Empty: FC<EmptyProps> = ({ iconSize = "lg", button, text = "Nothing to display", subText = "" }) => (
    <div className="col-span-full flex h-full w-full flex-col items-center justify-center gap-2 px-10 py-16 opacity-50">
        <LayersIcon
            className={clsx({ "text-base-300 mb-3": true, "h-52 w-52": iconSize === "lg", "h-24 w-24": iconSize === "sm" })}
            strokeWidth={2}
        />
        <h6 className="text-center text-2xl font-bold">{text}</h6>
        <p className="max-w-sm text-center text-base">{subText}</p>
        {button && (
            <>
                {button.loading ? (
                    <button className="btn btn-ghost btn-outline btn-wide mt-6" disabled>
                        {button?.text}
                    </button>
                ) : (
                    <LinkWithLocale className="btn btn-ghost btn-outline btn-wide mt-6" href={button.href} onClick={button.onClick}>
                        {button?.text}
                    </LinkWithLocale>
                )}
            </>
        )}
    </div>
);
