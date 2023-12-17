"use client";
import { BreadCrumbs, ErrorComponent } from "@/components/Common";
import { ErrorPageProps } from "@/utils/types";

export default function Error(props: ErrorPageProps) {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Advert"
                links={[
                    { href: "/", title: "Home" },
                    { href: "/search", title: "Search" },
                ]}
            />
            <ErrorComponent {...props} />
        </>
    );
}
