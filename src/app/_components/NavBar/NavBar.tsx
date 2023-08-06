import Link from "next/link";
import { PostAddLink } from "./NavBarButtons";
import { FC, Suspense } from "react";
import clsx from "clsx";
import { NavBarSearch } from "./NavBarSearch";
import { NavBarAuthServer } from "./NavBarAuthServer";

interface Props {
    hideBackground?: boolean;
    authRequired?: boolean;
}

export const NavBar: FC<Props> = ({ hideBackground, authRequired }) => {
    return (
        <div
            className={clsx(
                "navbar rounded-box relative z-20 text-neutral-content shadow shadow-neutral",
                hideBackground ? "bg-transparent" : "bg-neutral"
            )}
        >
            <Link href="/">
                <button className="btn-ghost btn px-0 text-xl normal-case sm:px-4">Car Sale</button>
            </Link>
            <div className="flex-1" />
            <div className="flex flex-row items-center gap-3 pr-0 sm:gap-4 sm:pr-2 lg:gap-6">
                <NavBarSearch />
                <PostAddLink />

                <Suspense fallback={<span className="loading loading-ring mx-2 flex h-full items-center" />}>
                    <NavBarAuthServer authRequired={authRequired} />
                </Suspense>
            </div>
        </div>
    );
};
