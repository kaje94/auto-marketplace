"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { NavBarClient } from "./NavBarClient";
import { Suspense } from "react";

export const NavBar = async () => {
    return (
        <Suspense fallback={<NavBarClient loading />}>
            <NavBarWithSession />
        </Suspense>
    );
};

const NavBarWithSession = async () => {
    const session = await getServerSession(authOptions);
    return <NavBarClient session={session} />;
};
