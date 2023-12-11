import { getSession } from "@auth0/nextjs-auth0/edge";
import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { EditListingForm } from "@/components/Forms/Listings/EditListingForm";
import { getScopedI18n } from "@/locales/server";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdPathParam } from "@/utils/types";

export default async function Page({ params }: ListingIdPathParam) {
    const session = await getSession();
    const [itemDetails, features, brands, profile, tBreadcrumbs] = await Promise.all([
        transformListingResponse(await api.getListingsItem(params.id)),
        api.getFeaturesList(),
        api.getVehicleBrands(),
        api.getMyProfileDetails(session?.user?.sub!),
        getScopedI18n("breadcrumbs"),
    ]);

    return (
        <>
            <BreadCrumbs
                currentPageTitle={tBreadcrumbs("edit")}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { title: tBreadcrumbs("dashboard") },
                    { title: tBreadcrumbs("manageAdverts"), href: "/dashboard/listings" },
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
