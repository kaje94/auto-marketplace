import { BreadCrumbs, ListingDetails } from "@/app/_components";
import { ListingDetailBanner } from "@/app/_components/ListingDetails";
import { authOptions } from "@/auth/authConfig";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdType } from "@/utils/types";
import { getServerSession } from "next-auth";

const ItemDetailPage = async ({ params }: { params: { id: ListingIdType } }) => {
    const session = await getServerSession(authOptions);
    const itemDetails = transformListingResponse(await api.getMyListingsItem(params.id));

    return (
        <>
            <BreadCrumbs
                currentPageTitle={itemDetails.title}
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "My Adverts", href: "/dashboard/my-listings" }]}
            />
            <ListingDetailBanner isAdmin={session?.user?.isAdmin} listingItem={itemDetails} />
            <ListingDetails
                itemDetails={itemDetails}
                withinDashboard={true}
                showSellerDetails={false}
                loggedInUser={{ email: session?.user?.email, id: session?.user?.id, isAdmin: session?.user?.isAdmin }}
                basePath="/dashboard/my-listings"
            />
        </>
    );
};

export default ItemDetailPage;
