import { clsx } from "clsx";
import { FC } from "react";
import { LinkWithLocale } from "@/components/Common/LinkWithLocale";
import { LayersIcon } from "@/icons";

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
    <div className="col-span-full flex w-full flex-col items-center justify-center gap-2 pt-16 opacity-50 md:px-10">
        <LayersIcon
            className={clsx({
                "text-base-300 mb-3 aspect-square": true,
                "h-1/2 w-1/2 max-w-xs": iconSize === "lg",
                "h-1/3 w-1/3 max-w-[250px]": iconSize === "sm",
            })}
            strokeWidth={2}
        />
        <h6 className={clsx("text-center font-bold", iconSize === "lg" ? "text-2xl" : "text-xl")}>{text}</h6>
        <p className={clsx("max-w-sm text-center ", iconSize === "lg" ? "text-base" : "text-sm")}>{subText}</p>
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
