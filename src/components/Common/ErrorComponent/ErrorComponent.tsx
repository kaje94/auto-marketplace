"use client";
import { clsx } from "clsx";
import Link from "next/link";
import { FC } from "react";
import { displayFont } from "@/app/fonts";
import { ActivityIcon, HomeIcon, RefreshIcon } from "@/icons";

interface Props {
    error?: Error | string;
    reset?: () => void;
    title?: string;
    subTitle?: string;
    showReset?: boolean;
    variant?: "sm" | "lg";
}

export const ErrorComponent: FC<Props> = ({ reset, error, title, subTitle, showReset = true, variant = "lg" }) => {
    const errorSubTitleText =
        subTitle || showReset
            ? "But do not worry, you can either try refreshing this page or go back to our home page and start over."
            : "But do not worry, you can alway head to our home page and start over.";
    let errorTitle = title || "Oops, something went wrong";
    if (error instanceof Error && error?.message?.endsWith("(404)")) {
        errorTitle = "Item is not available";
    }
    const errorName = typeof error === "string" ? "Error" : error?.name ?? "Error";
    const errorMessage = typeof error === "string" ? error : error?.message;
    return (
        <section className="flex h-full items-center p-16 text-primary-content">
            <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
                <div className="max-w-lg text-center">
                    {variant === "lg" && (
                        <h2 className="mb-8 flex justify-center text-9xl font-extrabold dark:text-gray-600">
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
                        <Link href="/">
                            <button className="btn-outline  btn">
                                <HomeIcon className="mr-3" /> Home
                            </button>
                        </Link>
                    </div>
                    {error && <div className="my-4 text-sm font-extralight opacity-50">{`${errorName}${errorMessage && `:${errorMessage}`}`}</div>}
                </div>
            </div>
        </section>
    );
};
