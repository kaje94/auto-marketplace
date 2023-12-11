import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { getScopedI18n } from "@/locales/server";
import { ChildrenProps } from "@/utils/types";

export async function generateMetadata(): Promise<Metadata> {
    const tManageListings = await getScopedI18n("metadata.manageListings");
    const title = tManageListings("title");
    return { title };
}

export default async function Layout({ children }: ChildrenProps) {
    const tBreadcrumbs = await getScopedI18n("breadcrumbs");

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tBreadcrumbs("manageAdverts")}
                links={[{ href: "/", title: tBreadcrumbs("home") }, { title: tBreadcrumbs("dashboard") }]}
            />
            {children}
        </>
    );
}
