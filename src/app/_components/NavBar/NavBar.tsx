"use server";
import Link from "next/link";
import { authOptions } from "@/auth/authConfig";
import { getServerSession } from "next-auth";
import { NavBarLogoutButton, NavBarLoginButton, NavBarMenuLink, PostAddLink } from "./NavBarButtons";
import { FC } from "react";
import clsx from "clsx";
import { NavBarSearch } from "./NavBarSearch";
import { AdvertIcon, UserIcon } from "@/icons";
import Image from "next/image";

interface Props {
    hideBackground?: boolean;
}

export const NavBar: FC<Props> = async ({ hideBackground }) => {
    const session = await getServerSession(authOptions);

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

                <div className="flex-none">
                    {session?.user ? (
                        <div className="dropdown-end dropdown">
                            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                                <div className="w-10 rounded-full ring ring-gray-600 ring-offset-base-100 duration-200 hover:ring-gray-400">
                                    <Image
                                        src="https://lh3.googleusercontent.com/a/AAcHTtd7MmSI5uFKspCkopw4j4fnk64GQYhA2zL-EOKSdjTtNxk=s96-c-rg-br100"
                                        height={40}
                                        width={40}
                                        alt="profile-image"
                                    />
                                </div>
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu rounded-box z-20 -mr-1 mt-3 w-52 rounded-tr-none bg-neutral p-2 text-neutral-content shadow-md shadow-black"
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
