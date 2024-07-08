"use client";
import { clsx } from "clsx";
import { FC, ReactNode } from "react";
import { displayFont } from "@/app/fonts";
import { LinkWithLocale } from "@/components/Common/LinkWithLocale";
import { ActivityIcon, HomeIcon, RefreshIcon } from "@/icons";

interface Props {
    /** Optional content to be rendered inside the ErrorComponent. */
    children?: ReactNode;
    /** The error object or error message to be displayed. */
    error?: Error | string;
    /** A function to be called when the reset button is clicked. */
    reset?: () => void;
    /** Determines whether to show the home button. */
    showHome?: boolean;
    /** Determines whether to show the reset button. */
    showReset?: boolean;
    /** The subtitle to be displayed. */
    subTitle?: string;
    /** The title to be displayed. */
    title?: string;
    /**
     * The variant of the ErrorComponent.
     * Possible values are "sm" (small) and "lg" (large).
     */
    variant?: "sm" | "lg";
    /** Additional class names to be applied to the ErrorComponent wrapper. */
    wrapClassnames?: string;
}

/** Error component to be displayed when ever there is a server error or when on 401 or 404 pages */
export const ErrorComponent: FC<Props> = ({
    reset,
    error,
    title,
    wrapClassnames,
    subTitle,
    showReset = true,
    variant = "lg",
    showHome = true,
    children,
}) => {
    const errorSubTitleText =
        subTitle ||
        (showReset
            ? "But do not worry, you can either try refreshing this page or go back to our home page and start over."
            : "But do not worry, you can alway head to our home page and start over.");
    let errorTitle = title || "Oops, something went wrong";
    if (error instanceof Error && error?.message?.endsWith("(404)")) {
        errorTitle = "Item is not available";
    }
    const errorName = typeof error === "string" ? "Error" : error?.name ?? "Error";
    const errorMessage = typeof error === "string" ? error : error?.message;
    return (
        <section className={clsx("flex h-full items-center p-0 text-primary-content md:p-8 xl:p-16", wrapClassnames)}>
            <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
                <div className="max-w-lg text-center">
                    {variant === "lg" && (
                        <h2 className="mb-8 flex justify-center text-9xl font-extrabold">
                            <ActivityIcon height={180} width={180} />
                        </h2>
                    )}

                    <p
                        className={clsx({
                            [displayFont.className]: true,
                            "text-3xl md:text-4xl": variant === "lg",
                            "text-2xl md:text-3xl": variant === "sm",
                        })}
                    >
                        {errorTitle}
                    </p>
                    <p className="mb-8 mt-4 dark:text-gray-400">{errorSubTitleText}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {showReset && reset && (
                            <button className="btn" onClick={reset}>
                                <RefreshIcon className="mr-3" /> Refresh
                            </button>
                        )}
                        {showHome && (
                            <LinkWithLocale href="/">
                                <button className="btn btn-outline">
                                    <HomeIcon className="mr-3" /> Home
                                </button>
                            </LinkWithLocale>
                        )}
                        {children}
                    </div>
                    {error && <div className="my-4 text-sm font-extralight opacity-50">{`${errorName}${errorMessage && `:${errorMessage}`}`}</div>}
                </div>
            </div>
        </section>
    );
};
