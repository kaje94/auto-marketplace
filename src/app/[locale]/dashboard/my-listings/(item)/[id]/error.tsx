"use client";
import { BreadCrumbs, ErrorComponent } from "@/components/Common";
import { useScopedI18n } from "@/locales/client";
import { ErrorPageProps } from "@/utils/types";

export default function Error(props: ErrorPageProps) {
    const tBreadcrumbs = useScopedI18n("breadcrumbs");

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tBreadcrumbs("advertItem")}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { title: tBreadcrumbs("dashboard") },
                    { title: tBreadcrumbs("myAdverts"), href: "/dashboard/my-listings" },
                ]}
            />
            <ErrorComponent {...props} />
        </>
    );
}
