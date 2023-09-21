import { BreadCrumbs } from "@/app/_components";
import { ListingDetails } from "@/app/_components/ListingDetails";

export default function Loading() {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Loading..."
                links={[
                    { href: "/", title: "Home" },
                    { href: "/search", title: "Search" },
                ]}
            />
            <ListingDetails loading />
        </>
    );
}
