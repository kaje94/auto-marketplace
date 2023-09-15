import { BreadCrumbs } from "@/app/_components";
import { ListingDetailBanner, ListingDetails } from "@/app/_components/ListingDetails";

const ItemDetailLoadingPage = async () => {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Loading..."
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "All Adverts", href: "/dashboard/listings" }]}
            />
            <ListingDetailBanner loading={true} />
            <ListingDetails loading withinDashboard={true} />
        </>
    );
};

export default ItemDetailLoadingPage;
