import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { ChildrenProps } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Create a New Listing" };

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Create new Advert"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { href: "/dashboard/my-listings", title: "My Adverts" }]}
            />
            {children}
        </>
    );
}
