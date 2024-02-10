import { clsx } from "clsx";
import { FC } from "react";
import { LinkWithLocale } from "@/components/Common/LinkWithLocale";
import { LayersIcon } from "@/icons";

interface EmptyProps {
    /** Action button to be shown within the Empty component. */
    button?: {
        /** The URL to navigate to when the button is clicked. */
        href: string;
        /** Specifies whether the button should be in a loading state. */
        loading?: boolean;
        /** Callback function to be executed when the button is clicked. */
        onClick?: () => void;
        /** The text to be displayed on the button. */
        text: string;
    };
    /** The size of the icon within the empty component. */
    iconSize?: "sm" | "lg";
    /** The subtext to be displayed below the main text. */
    subText?: string;
    /** The main text to be displayed. */
    text?: string;
}

/** Component to be shown whenever the number of items to display is zero */
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
