import { getSession } from "@auth0/nextjs-auth0/edge";
import { BreadCrumbs } from "@/components/Common";
import { ListingDetails, RelatedListingsCarousel } from "@/components/ListingDetails";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdPathParam } from "@/utils/types";

export default async function Page({ params }: ListingIdPathParam) {
    const [session, itemDetails] = await Promise.all([getSession(), transformListingResponse(await api.getPostedListingItem(params.id))]);
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
            <RelatedListingsCarousel itemDetails={itemDetails} />
        </>
    );
}
