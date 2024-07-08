import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { getAlternativeLinks } from "@/utils/countries";
import { ChildrenProps } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Update Profile", alternates: getAlternativeLinks("/dashboard/profile/edit") };

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Update Profile"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Profile", href: "/dashboard/profile" }]}
            />
            {children}
        </>
    );
}
