"use server";
import Link from "next/link";
import { authOptions } from "@/auth/authConfig";
import { getServerSession } from "next-auth";
import { NavBarLogoutButton, NavBarLoginButton, NavBarMenuLink, PostAddLink } from "./NavBarButtons";
import { FC } from "react";
import clsx from "clsx";
import { NavBarSearch } from "./NavBarSearch";
import { AdvertIcon, UserIcon } from "@/icons";

interface Props {
    hideBackground?: boolean;
}

export const NavBar: FC<Props> = async ({ hideBackground }) => {
    const session = await getServerSession(authOptions);
    return (
        <div
            className={clsx(
                "navbar relative z-20 rounded-[--rounded-box] text-neutral-content shadow shadow-neutral",
                hideBackground ? "bg-transparent" : "bg-neutral"
            )}
        >
            <Link href="/">
                <button className="btn-ghost btn text-xl normal-case">Car Sale</button>
            </Link>
            <div className="flex-1" />
            <div className="flex flex-row items-center gap-0 pr-0 sm:gap-4 sm:pr-2">
                <NavBarSearch />
                <PostAddLink />

                <div className="flex-none">
                    {session ? (
                        <div className="dropdown-end dropdown">
                            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                                <div className="w-10 rounded-full ring ring-gray-600 ring-offset-base-100 duration-200 hover:ring-gray-400">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI8DK8HCuvWNyHHg8enmbmmf1ue4AeeF3GDw&usqp=CAU" />
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu rounded-box z-20 -mr-1 mt-3 w-52 rounded-tr-none bg-neutral p-2 text-neutral-content"
                            >
                                <NavBarMenuLink link="/dashboard/profile" label="Profile" icon={<UserIcon height={18} />} />
                                <NavBarMenuLink link="/dashboard/my-ads" label="My Adverts" icon={<AdvertIcon height={18} />} />
                                <NavBarLogoutButton />
                            </ul>
                        </div>
                    ) : (
                        <NavBarLoginButton />
                    )}
                </div>
            </div>
        </div>
    );
};
