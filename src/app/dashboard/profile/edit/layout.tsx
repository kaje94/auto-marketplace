import { BreadCrumbs } from "@/components/Common";
import { ChildrenProps } from "@/utils/types";

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
