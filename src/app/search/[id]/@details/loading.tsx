import { BreadCrumbs } from "@/components/Common";
import { ListingDetails } from "@/components/ListingDetails";

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
