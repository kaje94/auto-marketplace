import { BreadCrumbs } from "@/components";
import { ListingDetailBanner, ListingDetails } from "@/components/ListingDetails";

export default function Loading() {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Loading..."
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Manage Adverts", href: "/dashboard/listings" }]}
            />
            <ListingDetailBanner loading={true} />
            <ListingDetails loading withinDashboard={true} />
        </>
    );
}
