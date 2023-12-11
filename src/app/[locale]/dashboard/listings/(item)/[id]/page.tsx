import { getSession } from "@auth0/nextjs-auth0/edge";
import { Metadata } from "next";
import { BreadCrumbs } from "@/components/Common";
import { ListingDetailBanner, ListingDetails } from "@/components/ListingDetails";
import { getScopedI18n } from "@/locales/server";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdPathParam } from "@/utils/types";

export default async function Page({ params }: ListingIdPathParam) {
    const [session, itemDetails, tBreadcrumbs] = await Promise.all([
        getSession(),
        transformListingResponse(await api.getListingsItem(params.id)),
        getScopedI18n("breadcrumbs"),
    ]);

    return (
        <>
            <BreadCrumbs
                currentPageTitle={itemDetails.title}
                links={[
                    { href: "/", title: tBreadcrumbs("home") },
                    { title: tBreadcrumbs("dashboard") },
                    { title: tBreadcrumbs("manageAdverts"), href: "/dashboard/listings" },
                ]}
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
