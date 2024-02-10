import { getSession } from "@auth0/nextjs-auth0/edge";
import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { EditListingForm } from "@/components/Forms/Listings/EditListingForm";
import { api } from "@/utils/api";
import { ListingIdPathParam } from "@/utils/types";

export const metadata: Metadata = { title: "Targabay - Edit Listing Item Details", alternates: {} };

export default async function Page({ params }: ListingIdPathParam) {
    const session = await getSession();
    const [itemDetails, features, brands, profile] = await Promise.all([
        api.getListingsItem(params.id),
        api.getFeaturesList(),
        api.getVehicleBrands(),
        api.getMyProfileDetails(session?.user?.sub!),
    ]);

    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[
                    { href: "/", title: "Home" },
                    { title: "Dashboard" },
                    { title: "All Advert", href: "/dashboard/listings" },
                    { title: itemDetails.title, href: `/dashboard/listings/${params.id}` },
                ]}
            />
            <EditListingForm
                brands={brands}
                features={features}
                listingItem={itemDetails}
                profile={profile}
                successRedirectPath="/dashboard/listings"
                userId={session?.user?.sub}
            />
        </>
    );
}
