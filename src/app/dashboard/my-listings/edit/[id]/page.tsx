import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { BreadCrumbs, EditListingForm } from "@/app/_components";
import { ListingIdType } from "@/utils/types";

const EditListingPage = async ({ params }: { params: { id: ListingIdType } }) => {
    let [itemDetails, features] = await Promise.all([api.getMyListingsItem(params.id), api.getFeaturesList()]);
    itemDetails = transformListingResponse(itemDetails);

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
            <EditListingForm features={features} listingItem={itemDetails} successRedirectPath="/dashboard/my-listings" />
        </>
    );
};

export default EditListingPage;
