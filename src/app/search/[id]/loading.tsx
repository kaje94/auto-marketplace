import { BreadCrumbs, ListingsCarouselSection, ListingDetails } from "@/app/_components";

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
            <ListingsCarouselSection loading title="Related Adverts" />
        </div>
    );
};

export default ItemDetailLoadingPage;
