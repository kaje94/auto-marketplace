import { getSession } from "@auth0/nextjs-auth0";
import queryString from "query-string";
import { BreadCrumbs } from "@/components/Common";
import { ListingDetails } from "@/components/ListingDetails";
import { ListingsCarousel } from "@/components/ListingsCarousel";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdType } from "@/utils/types";

export default async function Page({ params }: { params: { id: ListingIdType } }) {
    const [session, itemDetails, relatedListings] = await Promise.all([
        getSession(),
        transformListingResponse(await api.getPostedListingItem(params.id)),
        api.getRelatedListings(params.id),
    ]);
    api.incrementViews(params.id);

    return (
        <>
            <BreadCrumbs
                currentPageTitle={itemDetails.title}
                links={[
                    { href: "/", title: "Home" },
                    { href: "/search", title: "Search" },
                ]}
            />
            <ListingDetails
                itemDetails={itemDetails}
                loggedInUser={{ email: session?.user?.email, id: session?.user?.sub, isAdmin: session?.user?.isAdmin }}
            />
            <div className="divider mt-16">Related Adverts</div>
            <ListingsCarousel
                items={relatedListings?.map((item) => transformListingResponse(item))}
                viewMore={{
                    title: "View More",
                    subTitle: `View advertisements that are similar to ${itemDetails.title}`,
                    link: queryString.stringifyUrl({
                        url: "/search",
                        query: { VehicleType: itemDetails.vehicle.type, Brand: itemDetails.vehicle.brand, Model: itemDetails.vehicle.model },
                    }),
                }}
            />
        </>
    );
}
