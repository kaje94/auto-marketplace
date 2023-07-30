import { BreadCrumbs } from "@/app/_components";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <BreadCrumbs
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { href: "/dashboard/my-ads", title: "My Adverts" }]}
                currentPageTitle="Add new"
            />
            {children}
        </>
    );
}
