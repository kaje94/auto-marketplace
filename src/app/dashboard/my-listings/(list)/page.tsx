import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import qs from "query-string";
import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardMyListFilter } from "@/components/DashboardListHeader/DashboardMyListFilter";
import { DashboardMyListingsList } from "@/components/DashboardListings/DashboardListingsList";
import { DashboardMyListingsContextProvider } from "@/providers/dashboard-my-listings-provider";
import { api } from "@/utils/api";
import { transformListingsListResponse } from "@/utils/helpers";
import { MyListingsFilterSchema } from "@/utils/schemas";
import { SearchParams } from "@/utils/types";

export default async function Page({ searchParams }: SearchParams) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = MyListingsFilterSchema.parse(searchParams);
    const session = await getSession();
    const listings = transformListingsListResponse(await api.getMyListings(session?.user?.sub!, { PageNumber: Number(page), ...parsedSearchParams }));

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/dashboard/my-listings?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardMyListingsContextProvider>
            <DashboardListHeader
                addNewButton={{ label: "New Advert", path: "/dashboard/new-listing" }}
                filter={<DashboardMyListFilter />}
                itemCount={listings.totalCount}
            />
            <DashboardMyListingsList basePath="/dashboard/my-listings" listings={listings} userClaims={session?.user} />
        </DashboardMyListingsContextProvider>
    );
}
