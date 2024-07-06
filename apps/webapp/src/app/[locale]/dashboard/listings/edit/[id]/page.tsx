import { getSession } from "@auth0/nextjs-auth0";
import { Metadata } from "next";
import { getMyProfileAction } from "@/actions/profileActions";
import { getUserListingsItemAction } from "@/actions/userListingActions";
import { BreadCrumbs } from "@/components/Common";
import { EditListingForm } from "@/components/Forms/Listings/EditListingForm";
import { getListingTitleFromListing } from "@/utils/helpers";
import { ListingIdPathParam } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Edit Listing Item Details", alternates: {} };

export default async function Page({ params }: ListingIdPathParam) {
    const session = await getSession();
    const [itemDetails, profile] = await Promise.all([getUserListingsItemAction(params.id), getMyProfileAction(session?.user?.email!)]);

    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[
                    { href: "/", title: "Home" },
                    { title: "Dashboard" },
                    { title: "All Advert", href: "/dashboard/listings" },
                    { title: getListingTitleFromListing(itemDetails.data!), href: `/dashboard/listings/${params.id}` },
                ]}
            />
            <EditListingForm listingItem={itemDetails} profile={profile} successRedirectPath="/dashboard/listings" />
        </>
    );
}