"use client";
import { BreadCrumbs, ErrorComponent } from "@/components/Common";
import { useScopedI18n } from "@/locales/client";
import { ErrorPageProps } from "@/utils/types";

export default function Error(props: ErrorPageProps) {
    const tBreadcrumbs = useScopedI18n("breadcrumbs");

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tBreadcrumbs("advert")}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { href: "/search", title: tBreadcrumbs("search") },
                ]}
            />
            <ErrorComponent {...props} />
        </>
    );
}
