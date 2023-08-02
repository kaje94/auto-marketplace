import { BreadCrumbs } from "@/app/_components";
import { RelatedListings, ListingDetails } from "./_components";

const ItemDetailLoadingPage = async () => {
    return (
        <div className="my-10">
            <BreadCrumbs
                currentPageTitle="Loading..."
                links={[
                    { href: "/", title: "Home" },
                    { href: "/listing", title: "Search" },
                ]}
            />

            <ListingDetails loading />
            <RelatedListings loading />
        </div>
    );
};

export default ItemDetailLoadingPage;
