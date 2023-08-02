import { BreadCrumbs } from "@/app/_components";
import { api } from "@/utils/api";
import { RelatedListings, ListingDetails } from "./_components";

const ItemDetailPage = async ({ params }: { params: { id: string } }) => {
    // use suspense instead for getRelatedListings
    const [itemDetails, relatedListings] = await Promise.all([api.getPostedListingItem(params.id), api.getRelatedListings(params.id)]);
    const trimmedRelatedListings = relatedListings.slice(0, 4);

    return (
        <div className="my-10">
            <BreadCrumbs
                currentPageTitle={itemDetails.title}
                links={[
                    { href: "/", title: "Home" },
                    { href: "/listing", title: "Search" },
                ]}
            />

            <ListingDetails itemDetails={itemDetails} />
            <RelatedListings relatedListings={trimmedRelatedListings} />
        </div>
    );
};

export default ItemDetailPage;
