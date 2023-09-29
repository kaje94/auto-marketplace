import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { BreadCrumbs } from "@/components/Common";
import { ListingIdPathParam } from "@/utils/types";
import { EditListingForm } from "@/components/Forms/Listings/EditListingForm";

export default async function Page({ params }: ListingIdPathParam) {
    const [itemDetails, features] = await Promise.all([transformListingResponse(await api.getListingsItem(params.id)), api.getFeaturesList()]);

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
            <EditListingForm features={features} listingItem={itemDetails} successRedirectPath="/dashboard/listings" />
        </>
    );
}
