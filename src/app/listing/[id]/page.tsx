import { BreadCrumbs } from "@/app/_components";
import { api } from "@/utils/api";
import { RelatedListings, ListingDetails } from "./_components";
import { thumbHashToDataUrl, sortVehicleImages } from "@/utils/helpers";

const ItemDetailPage = async ({ params }: { params: { id: string } }) => {
    // use suspense instead for getRelatedListings
    let [itemDetails, relatedListings] = await Promise.all([api.getPostedListingItem(params.id), api.getRelatedListings(params.id)]);
    itemDetails = {
        ...itemDetails,
        vehicle: {
            ...itemDetails.vehicle,
            vehicleImages: sortVehicleImages(
                itemDetails.vehicle.vehicleImages.map((imageItem) => ({ ...imageItem, blurDataURL: thumbHashToDataUrl(imageItem.color) }))
            ),
        },
    };
    relatedListings.slice(0, 4).map((item) => ({
        ...item,
        vehicle: {
            ...item.vehicle,
            vehicleImages: sortVehicleImages(
                item.vehicle.vehicleImages.map((imageItem) => ({ ...imageItem, blurDataURL: thumbHashToDataUrl(imageItem.color) }))
            ),
        },
    }));

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
            <RelatedListings relatedListings={relatedListings} />
        </div>
    );
};

export default ItemDetailPage;
