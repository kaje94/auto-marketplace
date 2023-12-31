import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { getAlternativeLinks } from "@/utils/countries";
import { ChildrenProps } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - My Notifications", alternates: getAlternativeLinks("/dashboard/notifications") };

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs currentPageTitle="Notifications" links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} />
            {children}
        </>
    );
}
