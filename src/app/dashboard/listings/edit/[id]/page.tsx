import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { BreadCrumbs } from "@/app/_components";
import { ListingIdType } from "@/utils/types";
import { EditListingForm } from "@/app/_components/Forms/Listings/EditListingForm";

const EditListingPage = async ({ params }: { params: { id: ListingIdType } }) => {
    let [itemDetails, features] = await Promise.all([api.getListingsItem(params.id), api.getFeaturesList()]);
    itemDetails = transformListingResponse(itemDetails);

    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[
                    { href: "/", title: "Home" },
                    { title: "Dashboard" },
                    { title: "All Advert", href: "/dashboard/listings" },
                    {
                        title: itemDetails.title,
                        href: `/dashboard/listings/${params.id}`,
                    },
                ]}
            />
            <EditListingForm features={features} listingItem={itemDetails} successRedirectPath="/dashboard/listings" />
        </>
    );
};

export default EditListingPage;
