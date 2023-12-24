import { clsx } from "clsx";
import { FC } from "react";
import { displayFont, standardFont } from "@/app/fonts";

interface Props {
    /** Size of the font used in the logo */
    fontsize?: "text-xl" | "text-2xl" | "text-3xl";
}

/** Logo to be used in the navbar, footer, etc. */
export const Logo: FC<Props> = ({ fontsize = "text-xl" }) => {
    return (
        <span className={clsx("normal-case", displayFont.className, fontsize)}>
            Targa<span className={clsx("font-normal", standardFont.className)}>bay</span>
            <span className="text-accent">.</span>
        </span>
    );
};
