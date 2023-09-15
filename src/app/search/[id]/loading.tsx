import { BreadCrumbs } from "@/app/_components";
import { ListingDetails } from "@/app/_components/ListingDetails";
import { ListingsCarousel } from "@/app/_components/ListingsCarousel";

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
            <ListingsCarousel loading title="Related Adverts" />
        </div>
    );
};

export default ItemDetailLoadingPage;
