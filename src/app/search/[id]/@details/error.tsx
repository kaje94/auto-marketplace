"use client";
import { BreadCrumbs, ErrorComponent } from "@/app/_components";

export default function Error(props: { error: Error; reset: () => void }) {
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
