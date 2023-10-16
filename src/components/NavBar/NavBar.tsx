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
            const [notifications, profile] = await Promise.allSettled([
                api.getMyNotifications(session?.user?.sub!, { PageNumber: 1 }),
                api.getMyProfileDetails(session?.user?.sub!),
            ]);
            const notificationCount = notifications.status === "fulfilled" ? notifications.value.items?.filter((item) => !item.isShown)?.length : 0;

            return (
                <NavBarClient
                    notificationCount={notificationCount}
                    userClaims={session?.user}
                    userData={profile.status === "fulfilled" ? profile.value : undefined}
                />
            );
        }
        return <NavBarClient />;
    } catch {
        return <NavBarClient />;
    }
};
