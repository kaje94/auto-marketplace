import { BreadCrumbs, ListingDetails } from "@/app/_components";
import { ListingDetailBanner } from "@/app/_components/ListingDetails";
import { authOptions } from "@/auth/authConfig";
import { api } from "@/utils/api";
import { ListingStatusTypes } from "@/utils/enum";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdType } from "@/utils/types";
import { getServerSession } from "next-auth";

const ItemDetailPage = async ({ params }: { params: { id: ListingIdType } }) => {
    let [itemDetails, session] = await Promise.all([api.getListingsItem(params.id), getServerSession(authOptions)]);
    itemDetails = transformListingResponse(itemDetails);

    return (
        <>
            <BreadCrumbs
                currentPageTitle={itemDetails.title}
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Adverts", href: "/dashboard/listings" }]}
            />
            <ListingDetailBanner
                session={session}
                listingStatus={itemDetails.status}
                listingId={itemDetails.id}
                listingComment={itemDetails.status === ListingStatusTypes.Declined ? itemDetails.reviewComment : ""}
                listingName={itemDetails.title}
            />
            <ListingDetails itemDetails={itemDetails} withinDashboard={true} />
        </>
    );
};

export default ItemDetailPage;
