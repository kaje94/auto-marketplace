"use server";
import { FC } from "react";
import { getServerSession } from "next-auth";
import { authOptions, redirectToLoginPage } from "@/auth/authConfig";
import { NavBarAuthClient } from "./NavBarAuthClient";
interface Props {
    authRequired?: boolean;
}

export const NavBarAuthServer: FC<Props> = async ({ authRequired }) => {
    const session = await getServerSession(authOptions);
    if (authRequired && (!session?.user || session?.error === "RefreshAccessTokenError")) {
        redirectToLoginPage();
    }

    return <NavBarAuthClient authRequired={authRequired} serverSession={session} />;
};
