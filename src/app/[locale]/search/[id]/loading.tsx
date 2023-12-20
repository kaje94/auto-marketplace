import { BreadCrumbs } from "@/components/Common";
import { ListingDetails } from "@/components/Listings/ListingDetails";
import { ListingsCarousel } from "@/components/Listings/ListingsCarousel";

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
            <div className="divider mt-16">Related Adverts</div>
            <ListingsCarousel loading />
        </>
    );
}
