import { BreadCrumbs } from "@/components/Common";
import { authOptions } from "@/auth/authConfig";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdType } from "@/utils/types";
import { getServerSession } from "next-auth";
import { ListingDetails } from "@/components/ListingDetails";

export default async function Page({ params }: { params: { id: ListingIdType } }) {
    const [session, itemDetails] = await Promise.all([
        getServerSession(authOptions),
        transformListingResponse(await api.getPostedListingItem(params.id)),
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
                loggedInUser={{ email: session?.user?.email, id: session?.user?.id, isAdmin: session?.user?.isAdmin }}
            />
        </>
    );
}
