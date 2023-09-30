"use server";
import { getSession } from "@auth0/nextjs-auth0";
import { Suspense } from "react";
import { api } from "@/utils/api";
import { NavBarClient } from "./NavBarClient";

export const NavBar = async () => {
    return (
        <Suspense fallback={<NavBarClient loading />}>
            <NavBarWithSession />
        </Suspense>
    );
};

const NavBarWithSession = async () => {
    try {
        const session = await getSession();
        if (session) {
            const notifications = await api.getMyNotifications(session?.user?.sub!, { PageNumber: 1 });
            const notificationCount = notifications.items?.filter((item) => !item.isShown)?.length;

            return <NavBarClient notificationCount={notificationCount} userClaims={session?.user} />;
        }
        return <NavBarClient />;
    } catch {
        return <NavBarClient />;
    }
};
