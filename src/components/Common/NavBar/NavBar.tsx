"use server";
import { getSession } from "@auth0/nextjs-auth0/edge";
import { headers as nextHeaders } from "next/headers";
import { Suspense } from "react";
import { api } from "@/utils/api";
import { NavBarClient } from "./NavBarClient";

/** Navbar component with data fetched within a suspense wrapper */
export const NavBar = async () => {
    return (
        <Suspense fallback={<NavBarClient loading />}>
            <NavBarWithSession />
        </Suspense>
    );
};

/** Navbar component with data fetched from the server side and will fallback to default navbar if user is not logged in or an error is encountered */
const NavBarWithSession = async () => {
    const originLocal = nextHeaders().get("x-origin-locale");
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
                    originLocale={originLocal}
                    userClaims={session?.user}
                    userData={profile.status === "fulfilled" ? profile.value : undefined}
                />
            );
        }
        return <NavBarClient originLocale={originLocal} />;
    } catch {
        return <NavBarClient originLocale={originLocal} />;
    }
};
