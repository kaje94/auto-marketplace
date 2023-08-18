import { BreadCrumbs, ListingDetails } from "@/app/_components";
import { ListingDetailBanner } from "@/app/_components/ListingDetails";
import { authOptions } from "@/auth/authConfig";
import { api } from "@/utils/api";
import { sortVehicleImages, thumbHashToDataUrl } from "@/utils/helpers";
import { getServerSession } from "next-auth";

const ItemDetailPage = async ({ params }: { params: { id: string } }) => {
    let [itemDetails, session] = await Promise.all([api.getListingsItem(params.id), getServerSession(authOptions)]);
    itemDetails = {
        ...itemDetails,
        vehicle: {
            ...itemDetails.vehicle,
            vehicleImages: sortVehicleImages(
                itemDetails.vehicle.vehicleImages.map((imageItem) => ({ ...imageItem, blurDataURL: thumbHashToDataUrl(imageItem.color) }))
            ),
        },
    };

    return (
        <>
            <BreadCrumbs
                currentPageTitle={itemDetails.title}
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Adverts", href: "/dashboard/listings" }]}
            />
            <ListingDetailBanner session={session} listingStatus={itemDetails.status} listingId={itemDetails.id} />
            <ListingDetails itemDetails={itemDetails} withinDashboard={true} />
        </>
    );
};

export default ItemDetailPage;
