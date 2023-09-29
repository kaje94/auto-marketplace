import { BreadCrumbs } from "@/components/Common";
import { ChildrenProps } from "@/utils/types";

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { href: "/dashboard/my-subscriptions", title: "My Subscription" }]}
                currentPageTitle="Create new Subscription"
            />
            {children}
        </>
    );
}
