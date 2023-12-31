import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { getAlternativeLinks } from "@/utils/countries";
import { ChildrenProps } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - My Adverts", alternates: getAlternativeLinks("/dashboard/my-listings") };

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs currentPageTitle="My Adverts" links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} />
            {children}
        </>
    );
}
