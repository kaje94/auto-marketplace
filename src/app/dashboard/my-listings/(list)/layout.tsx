import { NavBar, Footer, BreadCrumbs } from "@/app/_components";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="My Adverts" />
            {children}
        </>
    );
}
