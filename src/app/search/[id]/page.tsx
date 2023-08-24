import { BreadCrumbs, RelatedListings, ListingDetails } from "@/app/_components";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdType } from "@/utils/types";

const ItemDetailPage = async ({ params }: { params: { id: ListingIdType } }) => {
    // use suspense instead for getRelatedListings
    let [itemDetails, relatedListings] = await Promise.all([api.getPostedListingItem(params.id), api.getRelatedListings(params.id)]);
    itemDetails = transformListingResponse(itemDetails);
    relatedListings.slice(0, 4).map((item) => transformListingResponse(item));

    api.incrementViews(params.id);

    return (
        <div className="my-10">
            <BreadCrumbs
                currentPageTitle={itemDetails.title}
                links={[
                    { href: "/", title: "Home" },
                    { href: "/search", title: "Search" },
                ]}
            />
            <ListingDetails itemDetails={itemDetails} />
            <RelatedListings relatedListings={relatedListings} />
        </div>
    );
};

export default ItemDetailPage;
