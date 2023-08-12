"use client";
import { UserIcon, AdvertIcon } from "@/icons";
import { NavBarMenuLink, NavBarLogoutButton, NavBarLoginButton } from "./NavBarButtons";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { FC, useEffect } from "react";

interface Props {
    authRequired?: boolean;
}

export const NavBarAuth: FC<Props> = ({ authRequired }) => {
    const { data: clientSession, status, update } = useSession({ required: authRequired!! });

    useEffect(() => {
        if (clientSession?.error === "RefreshAccessTokenError" && authRequired) {
            signIn("duende-identity-server6");
        }
    }, [clientSession, authRequired]);

    useEffect(() => {
        if (authRequired && clientSession && clientSession?.expires_at && clientSession?.expires_at * 1000 > Date.now()) {
            const timeDifference = clientSession?.expires_at * 1000 - Date.now();
            const timeOut = setTimeout(() => {
                update();
            }, timeDifference + 1000);
            return () => clearTimeout(timeOut);
        }
    }, [update, clientSession, authRequired]);

    return (
        <div className="flex-none">
            {status === "loading" ? (
                <span className="loading loading-ring mx-2 flex h-full items-center" />
            ) : (
                <>
                    {clientSession?.user ? (
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
                </>
            )}
        </div>
    );
};
