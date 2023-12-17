"use client";
import { BreadCrumbs } from "@/components/Common";
import { SubscriptionForm } from "@/components/Forms/ListingSubscriptions/SubscriptionForm";
import { useScopedI18n } from "@/locales/client";

export default function Loading() {
    const tBreadcrumbs = useScopedI18n("breadcrumbs");

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tBreadcrumbs("edit")}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { title: tBreadcrumbs("dashboard") },
                    { title: tBreadcrumbs("mySubscriptions"), href: "/dashboard/my-subscriptions" },
                ]}
            />
            <SubscriptionForm isLoading />
        </>
    );
}
