"use client";
import { BreadCrumbs, ErrorComponent } from "@/components/Common";
import { ErrorPageProps } from "@/utils/types";

export default function Error(props: ErrorPageProps) {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Manage Subscriptions", href: "/dashboard/subscriptions" }]}
            />
            <ErrorComponent {...props} />
        </>
    );
}
