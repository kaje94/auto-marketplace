"use client";
import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { NavBarAuth } from "./NavBarAuth";
import { PostAddLink, SearchLink } from "./NavBarButtons";

export const NavBarClient = ({
    session,
    loading,
    notificationCount,
}: {
    session?: Session | null;
    loading?: boolean;
    notificationCount?: number;
}) => {
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
                    "navbar rounded-box relative z-20 min-h-[70px] items-center justify-between gap-8 text-neutral-content shadow shadow-neutral",
                    pathName === "/" ? "bg-transparent !shadow-xl" : "bg-neutral"
                )}
            >
                <Link href="/" className="ml-0 sm:ml-1 md:ml-2">
                    <button className="btn-ghost btn px-0 text-xl normal-case">Car Sale</button>
                </Link>
                <div className="flex flex-row items-center gap-0 pr-0 sm:gap-2 sm:pr-2 lg:gap-4">
                    <SearchLink />
                    <PostAddLink />
                    <NavBarAuth session={session} loading={loading} key={`navbar-auth-${pathName}`} notificationCount={notificationCount} />
                </div>
            </div>
        </div>
    );
};
