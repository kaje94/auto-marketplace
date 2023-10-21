import { BreadCrumbs } from "@/components/Common";
import { ChildrenProps } from "@/utils/types";

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs currentPageTitle="My Adverts" links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} />
            {children}
        </>
    );
}
