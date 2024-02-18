"use client";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { clsx } from "clsx";
import dynamic from "next/dynamic";
import { useParams, usePathname } from "next/navigation";
import { FC } from "react";
import { LinkWithLocale, Logo } from "@/components/Common";
import { NavBarAuth } from "./NavBarAuth";
import { PostAddLink, SearchLink } from "./NavBarButtons";

/** Lazily loaded country select button */
const NavBarCountryBtn = dynamic(() => import("./NavBarCountryBtn").then((mod) => mod.NavBarCountryBtn), {
    loading: () => (
        <button className="btn btn-square !btn-neutral btn-sm animate-pulse opacity-70 " disabled>
            <span className="loading loading-ring loading-xs" />
        </button>
    ),
    ssr: false,
});

interface Props {
    /** Show admin links in navbar panel */
    idAdmin?: boolean;
    /** Details of logged in user */
    kindeUser?: KindeUser;
    /** Indicate whether user details are being loaded */
    loading?: boolean;
    /** Notification count shown in the navbar */
    notificationCount?: number;
    /** The country code that user is making the request from */
    originLocale?: string | null;
}

/** Nav bar component used throughout the web app */
export const NavBarClient: FC<Props> = ({ kindeUser, loading, notificationCount, idAdmin, originLocale }) => {
    const params = useParams();
    const pathName = usePathname();
    const isLandingPage = pathName === `/${params.locale}`;

    return (
        <>
            {/* {userData && userClaims?.new_user && <NewUserOnboardModal userClaims={userClaims} userData={userData} />} */}
            <div
                className={clsx({
                    "container mx-auto p-0 sm:p-2 xl:p-7 2xl:p-8 flex items-center justify-center !pb-2": true,
                    "absolute top-0 left-0 right-0": isLandingPage,
                })}
            >
                <div
                    className={clsx(
                        "navbar relative z-20 min-h-[70px] items-center justify-between gap-0 rounded-none text-neutral-content shadow shadow-neutral sm:rounded-box min-[360px]:gap-4",
                        isLandingPage ? "bg-transparent !shadow-xl" : "bg-neutral",
                    )}
                >
                    <LinkWithLocale className="ml-0 sm:ml-1 md:ml-2" href="/">
                        <button className="btn btn-ghost hidden px-0 min-[340px]:block">
                            <Logo />
                        </button>
                    </LinkWithLocale>
                    <div className="flex flex-row items-center gap-0.5 pr-0 sm:gap-2 sm:pr-2 lg:gap-4">
                        <SearchLink />
                        <PostAddLink isLoggedIn={!!kindeUser} />
                        <NavBarCountryBtn originLocale={originLocale} />
                        <NavBarAuth isAdmin={idAdmin} kindeUser={kindeUser} loading={loading} notificationCount={notificationCount} />
                    </div>
                </div>
            </div>
        </>
    );
};
