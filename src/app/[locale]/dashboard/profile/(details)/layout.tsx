import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { getAlternativeLinks } from "@/utils/countries";
import { ChildrenProps } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - My Profile", alternates: getAlternativeLinks("/dashboard/profile") };

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs currentPageTitle="Profile" links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} />
            {children}
        </>
    );
}
