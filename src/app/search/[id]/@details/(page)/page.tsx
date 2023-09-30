import { getSession } from "@auth0/nextjs-auth0";
import { BreadCrumbs } from "@/components/Common";
import { ListingDetails } from "@/components/ListingDetails";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdType } from "@/utils/types";

export default async function Page({ params }: { params: { id: ListingIdType } }) {
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
        </>
    );
}
