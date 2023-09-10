"use server";
import { UserIcon, AdvertIcon, RssIcon, ListIcon, ClipboardIcon } from "@/icons";
import { NavBarMenuLink, NavBarLogoutButton, NavBarLoginButton } from "./NavBarButtons";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";

export const NavBarAuth = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className="flex-none">
            {session ? (
                <div className="dropdown-end dropdown">
                    <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                        <div className="w-10 rounded-full ring ring-gray-600 ring-offset-base-100 duration-200 hover:ring-gray-400">
                            <Image
                                src="https://lh3.googleusercontent.com/a/AAcHTtd7MmSI5uFKspCkopw4j4fnk64GQYhA2zL-EOKSdjTtNxk=s96-c-rg-br100"
                                height={40}
                                width={40}
                                alt="profile-image"
                                className="object-cover"
                            />
                        </div>
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu rounded-box z-20 -mr-1 mt-3 w-60 rounded-tr-none bg-neutral p-2 text-neutral-content shadow-md shadow-black"
                    >
                        <NavBarMenuLink link="/dashboard/profile" label="Profile" icon={<UserIcon height={18} />} />
                        <NavBarMenuLink link="/dashboard/my-listings" label="My Adverts" icon={<AdvertIcon height={18} />} />
                        <NavBarMenuLink link="/dashboard/my-subscriptions" label="My Subscriptions" icon={<RssIcon height={18} />} />
                        {session?.user?.isAdmin && (
                            <>
                                <NavBarMenuLink link="/dashboard/listings" label="All Adverts" icon={<ListIcon height={18} />} />
                                <NavBarMenuLink link="/dashboard/subscriptions" label="All Subscriptions" icon={<ClipboardIcon height={18} />} />
                            </>
                        )}
                        <NavBarLogoutButton />
                    </ul>
                </div>
            ) : (
                <NavBarLoginButton />
            )}
        </div>
    );
};
