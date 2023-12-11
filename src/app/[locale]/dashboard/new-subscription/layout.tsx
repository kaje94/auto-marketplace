import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { getScopedI18n } from "@/locales/server";
import { ChildrenProps } from "@/utils/types";

export async function generateMetadata(): Promise<Metadata> {
    const tCreateSubscription = await getScopedI18n("metadata.createSubscriptionRoute");
    const title = tCreateSubscription("title");
    return { title };
}

export default async function Layout({ children }: ChildrenProps) {
    const tBreadcrumbs = await getScopedI18n("breadcrumbs");

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tBreadcrumbs("newSubscription")}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { title: tBreadcrumbs("dashboard") },
                    { href: "/dashboard/my-subscriptions", title: tBreadcrumbs("mySubscriptions") },
                ]}
            />
            {children}
        </>
    );
}
