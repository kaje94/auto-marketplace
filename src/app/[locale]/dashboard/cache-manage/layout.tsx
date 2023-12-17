import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { ChildrenProps } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Manage Cache" };

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs currentPageTitle="Manage Cache" links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} />
            {children}
        </>
    );
}
