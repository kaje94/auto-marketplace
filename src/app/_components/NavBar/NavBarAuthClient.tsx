"use client";
import { UserIcon, AdvertIcon } from "@/icons";
import { NavBarMenuLink, NavBarLogoutButton, NavBarLoginButton } from "./NavBarButtons";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { Session } from "next-auth";

interface Props {
    authRequired?: boolean;
    serverSession?: Session | null;
}

export const NavBarAuthClient: FC<Props> = ({ authRequired, serverSession }) => {
    const [isFocused, setIsFocused] = useState(false);
    const { data: clientSession, status, update } = useSession({ required: authRequired!! });

    const onFocus = () => setIsFocused(true);
    const onBlur = () => setIsFocused(false);

    useEffect(() => {
        window.addEventListener("focus", onFocus);
        window.addEventListener("blur", onBlur);
        // Calls onFocus when the window first loads
        onFocus();
        // Specify how to clean up after this effect:
        return () => {
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("blur", onBlur);
        };
    }, []);

    useEffect(() => {
        if (clientSession?.error === "RefreshAccessTokenError" && authRequired) {
            signIn("duende-identity-server6");
        }
    }, [clientSession, authRequired]);

    useEffect(() => {
        if (isFocused && clientSession && clientSession?.expires_at && clientSession?.expires_at * 1000 > Date.now()) {
            const timeDifference = clientSession?.expires_at * 1000 - Date.now();
            const timeOut = setTimeout(() => {
                update();
            }, timeDifference + 1000);
            return () => clearTimeout(timeOut);
        }
    }, [update, clientSession, isFocused]);

    const session = status === "loading" ? serverSession : clientSession;

    return (
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
    );
};
