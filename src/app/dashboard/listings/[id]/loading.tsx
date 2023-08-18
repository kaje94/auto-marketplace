import { BreadCrumbs, ListingDetails } from "@/app/_components";
import { ListingDetailBanner } from "@/app/_components/ListingDetails";

const ItemDetailLoadingPage = async () => {
    return (
        <>
            <BreadCrumbs
                currentPageTitle="Loading..."
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Adverts", href: "/dashboard/listings" }]}
            />
            <ListingDetailBanner loading />
            <ListingDetails loading withinDashboard={true} />
        </>
    );
};

export default ItemDetailLoadingPage;
