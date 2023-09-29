"use server";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { authOptions } from "@/auth/authConfig";
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
    const session = await getServerSession(authOptions);
    const notifications = await api.getMyNotifications(session?.user?.id!, { PageNumber: 1 });
    const notificationCount = notifications.items?.filter((item) => !item.isShown)?.length;

    return <NavBarClient session={session} notificationCount={notificationCount} />;
};
