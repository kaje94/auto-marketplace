import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { ChildrenProps } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Create a Subscription" };

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Create new Subscription"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { href: "/dashboard/my-subscriptions", title: "My Subscription" }]}
            />
            {children}
        </>
    );
}
