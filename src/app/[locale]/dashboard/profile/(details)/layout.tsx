import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { getScopedI18n } from "@/locales/server";
import { ChildrenProps } from "@/utils/types";

export async function generateMetadata(): Promise<Metadata> {
    const tProfilePage = await getScopedI18n("metadata.profileDetailsRoute");
    const title = tProfilePage("title");
    return { title };
}

export default async function Layout({ children }: ChildrenProps) {
    const tBreadcrumbs = await getScopedI18n("breadcrumbs");

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tBreadcrumbs("profile")}
                links={[{ href: "/", title: tBreadcrumbs("home") }, { title: tBreadcrumbs("dashboard") }]}
            />
            {children}
        </>
    );
}
