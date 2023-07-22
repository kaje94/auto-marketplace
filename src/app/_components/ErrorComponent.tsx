"use client";
import Link from "next/link";
import { HomeIcon, RefreshIcon, ActivityIcon } from "@/icons";
import { righteousFont } from "@/app/fonts";
import clsx from "clsx";
import { FC } from "react";

interface Props {
    error?: Error;
    reset?: () => void;
    title?: string;
    subTitle?: string;
}

export const ErrorComponent: FC<Props> = ({
    reset,
    error,
    title = "Oops, something went wrong",
    subTitle = "But do not worry, you can either try refreshing this page or go back to our home page.",
}) => {
    return (
        <section className="flex h-full items-center p-16 text-primary-content">
            <div className="container mx-auto my-8 flex flex-col items-center justify-center px-5">
                <div className="max-w-lg text-center">
                    <h2 className="mb-8 flex justify-center text-9xl font-extrabold dark:text-gray-600">
                        <ActivityIcon width={180} height={180} />
                    </h2>
                    <p className={clsx(righteousFont.className, "text-3xl md:text-4xl")}>{title}</p>
                    <p className="mb-8 mt-4 dark:text-gray-400">{subTitle}</p>
                    <div className="flex justify-center gap-3">
                        {reset && (
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
                    {error && <div className="my-4 text-sm font-extralight opacity-50">{`${error?.name}: ${error?.message}`}</div>}
                </div>
            </div>
        </section>
    );
};
