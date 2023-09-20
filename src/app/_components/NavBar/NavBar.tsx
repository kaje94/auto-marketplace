"use client";
import Link from "next/link";
import { PostAddLink, SearchLink } from "./NavBarButtons";
import clsx from "clsx";
import { NavBarAuth } from "./NavBarAuth";
import { usePathname } from "next/navigation";

export const NavBar = () => {
    const pathName = usePathname();
    const absolutePosition = ["/", "/auth/login"].includes(pathName);
    return (
        <div
            className={clsx({
                "container mx-auto p-4 xl:p-7 2xl:p-8 flex items-center justify-center !pb-0": true,
                "absolute top-0 left-0 right-0": absolutePosition,
            })}
        >
            <div
                className={clsx(
                    "navbar rounded-box relative z-20 justify-between gap-8 text-neutral-content shadow shadow-neutral",
                    pathName === "/" ? "bg-transparent !shadow-xl" : "bg-neutral"
                )}
            >
                <Link href="/">
                    <button className="btn-ghost btn px-0 text-xl normal-case">Car Sale</button>
                </Link>
                <div className="flex flex-row items-center gap-0 pr-0 sm:gap-2 sm:pr-2 lg:gap-4">
                    <SearchLink />
                    <PostAddLink />
                    <NavBarAuth />
                </div>
            </div>
        </div>
    );
};
