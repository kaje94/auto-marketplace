import { BreadCrumbs } from "@/app/_components";
import { authOptions } from "@/auth/authConfig";
import { api } from "@/utils/api";
import { transformListingResponse } from "@/utils/helpers";
import { ListingIdType } from "@/utils/types";
import { getServerSession } from "next-auth";
import { ListingDetails } from "@/app/_components/ListingDetails";

export default async function Page({ params }: { params: { id: ListingIdType } }) {
    const itemDetails = transformListingResponse(await api.getPostedListingItem(params.id));

    const session = await getServerSession(authOptions);

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
