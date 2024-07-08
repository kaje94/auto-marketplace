import { getSession } from "@auth0/nextjs-auth0";
import { Metadata } from "next";
import { getUserListingsItemAction } from "@/actions/userListingActions";
import { BreadCrumbs } from "@/components/Common";
import { ListingDetailBanner, ListingDetails } from "@/components/Listings/ListingDetails";
import { getListingTitleFromListing } from "@/utils/helpers";
import { ListingIdPathParam } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Manage Listing Item", alternates: {} };

export default async function Page({ params }: ListingIdPathParam) {
    const [session, itemDetails] = await Promise.all([getSession(), getUserListingsItemAction(params.id)]);

    return (
        <>
            <BreadCrumbs
                currentPageTitle={getListingTitleFromListing(itemDetails.data!)}
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Manage Adverts", href: "/dashboard/listings" }]}
            />
            <ListingDetailBanner isAdmin={session?.user?.isAdmin} listingItem={itemDetails} />
            <ListingDetails
                basePath="/dashboard/listings"
                itemDetails={itemDetails}
                loggedInUser={{ email: session?.user?.email, isAdmin: session?.user?.isAdmin }}
                withinDashboard={true}
            />
        </>
    );
}
