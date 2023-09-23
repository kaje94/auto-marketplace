import { BreadCrumbs } from "@/app/_components";
import { ListingDetailBanner, ListingDetails } from "@/app/_components/ListingDetails";

export default function Loading() {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Loading..."
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Adverts", href: "/dashboard/my-listings" }]}
            />
            <ListingDetailBanner loading={true} />
            <ListingDetails loading withinDashboard={true} showSellerDetails={false} />
        </>
    );
}
