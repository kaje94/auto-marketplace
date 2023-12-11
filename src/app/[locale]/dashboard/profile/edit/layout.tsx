import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { getScopedI18n } from "@/locales/server";
import { ChildrenProps } from "@/utils/types";

export async function generateMetadata(): Promise<Metadata> {
    const tEditProfile = await getScopedI18n("metadata.profileEditRoute");
    const title = tEditProfile("title");
    return { title };
}

export default async function Layout({ children }: ChildrenProps) {
    const tBreadcrumbs = await getScopedI18n("breadcrumbs");

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tBreadcrumbs("updateProfile")}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { title: tBreadcrumbs("dashboard") },
                    { title: tBreadcrumbs("profile"), href: "/dashboard/profile" },
                ]}
            />
            {children}
        </>
    );
}
