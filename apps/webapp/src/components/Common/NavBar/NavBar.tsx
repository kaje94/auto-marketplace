"use server";
import { getSession } from "@auth0/nextjs-auth0";
import { headers as nextHeaders } from "next/headers";
import { Suspense } from "react";
import { getUserNotificationsAction } from "@/actions/notificationActions";
import { getMyProfileAction } from "@/actions/profileActions";
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
                getUserNotificationsAction({ page: { pageNumber: 1, pageSize: 10 }, filters: { userFilters: {} } }, session?.user?.email!),
                getMyProfileAction(session?.user?.email),
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
