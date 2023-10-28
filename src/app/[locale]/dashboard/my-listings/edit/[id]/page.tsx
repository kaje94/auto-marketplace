import { getSession } from "@auth0/nextjs-auth0/edge";
import { BreadCrumbs } from "@/components/Common";
import { EditListingForm } from "@/components/Forms/Listings/EditListingForm";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdPathParam } from "@/utils/types";

export default async function Page({ params }: ListingIdPathParam) {
    const session = await getSession();
    const [itemDetails, features, brands, profile] = await Promise.all([
        transformListingResponse(await api.getMyListingsItem(params.id)),
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
                    { title: "My Adverts", href: "/dashboard/my-listings" },
                    {
                        title: itemDetails.title,
                        href: `/dashboard/my-listings/${params.id}`,
                    },
                ]}
            />
            <EditListingForm
                brands={brands}
                features={features}
                listingItem={itemDetails}
                profile={profile}
                successRedirectPath="/dashboard/my-listings"
                userId={session?.user?.sub}
            />
        </>
    );
}
