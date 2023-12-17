import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { ChildrenProps } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - My Subscriptions" };

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs currentPageTitle="My Subscriptions" links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} />
            {children}
        </>
    );
}
