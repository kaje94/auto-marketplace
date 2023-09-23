import { NavBar, Footer, BreadCrumbs } from "@/app/_components";
import { ChildrenProps } from "@/utils/types";

export default function Layout({ children }: ChildrenProps) {
    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="My Adverts" />
            {children}
        </>
    );
}
