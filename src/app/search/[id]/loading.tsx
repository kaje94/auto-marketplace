import { BreadCrumbs, RelatedListings, ListingDetails } from "@/app/_components";

const ItemDetailLoadingPage = async () => {
    return (
        <div className="my-10">
            <BreadCrumbs
                currentPageTitle="Loading..."
                links={[
                    { href: "/", title: "Home" },
                    { href: "/search", title: "Search" },
                ]}
            />

            <ListingDetails loading />
            <RelatedListings loading />
        </div>
    );
};

export default ItemDetailLoadingPage;
