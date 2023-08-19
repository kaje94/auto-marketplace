import { api } from "@/utils/api";
import { EditListingForm } from "./_components/EditListingForm";
import { transformListingResponse } from "@/utils/helpers";
import { BreadCrumbs } from "@/app/_components";

const EditListingPage = async ({ params }: { params: { id: string } }) => {
    let [itemDetails, features] = await Promise.all([api.getListingsItem(params.id), api.getFeatureList()]);
    itemDetails = transformListingResponse(itemDetails);

    return (
        <>
            <BreadCrumbs
                currentPageTitle="Edit"
                links={[
                    { href: "/", title: "Home" },
                    { title: "Dashboard" },
                    { title: "My Adverts", href: "/dashboard/listings" },
                    {
                        title: itemDetails.title,
                        href: `/dashboard/listings/${params.id}`,
                    },
                ]}
            />
            <EditListingForm features={features} listingItem={itemDetails} />
        </>
    );
};

export default EditListingPage;
