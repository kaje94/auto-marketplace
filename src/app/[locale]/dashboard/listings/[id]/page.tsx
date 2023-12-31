import { getSession } from "@auth0/nextjs-auth0/edge";
import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { ListingDetailBanner, ListingDetails } from "@/components/Listings/ListingDetails";
import { api } from "@/utils/api";
import { ListingIdPathParam } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Manage Listing Item", alternates: {} };

export default async function Page({ params }: ListingIdPathParam) {
    const [session, itemDetails] = await Promise.all([getSession(), api.getListingsItem(params.id)]);

    return (
        <>
            <BreadCrumbs
                currentPageTitle={itemDetails.title}
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Manage Adverts", href: "/dashboard/listings" }]}
            />
            <ListingDetailBanner isAdmin={session?.user?.isAdmin} listingItem={itemDetails} />
            <ListingDetails
                basePath="/dashboard/listings"
                itemDetails={itemDetails}
                loggedInUser={{ email: session?.user?.email, id: session?.user?.sub, isAdmin: session?.user?.isAdmin }}
                withinDashboard={true}
            />
        </>
    );
}
