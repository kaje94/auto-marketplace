import { BreadCrumbs } from "@/components/Common";
import { ChildrenProps } from "@/utils/types";

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
