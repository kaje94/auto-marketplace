import { BreadCrumbs } from "@/components";
import { ChildrenProps } from "@/utils/types";

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { href: "/dashboard/my-listings", title: "My Adverts" }]}
                currentPageTitle="Create new Advert"
            />
            {children}
        </>
    );
}
