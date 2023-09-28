"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { NavBarClient } from "./NavBarClient";
import { Suspense } from "react";
import { api } from "@/utils/api";

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
