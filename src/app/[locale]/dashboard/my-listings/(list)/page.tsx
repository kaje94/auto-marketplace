import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import qs from "query-string";
import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardMyListFilterButton } from "@/components/Dashboard/DashboardListHeader/DashboardMyListFilterButton";
import { DashboardMyListingsList } from "@/components/Dashboard/DashboardListings/DashboardListingsList";
import { DashboardMyListingsContextProvider } from "@/providers/DashboardMyListingsContextProvider";
import { api } from "@/utils/api";
import { MyListingsFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = MyListingsFilterSchema.parse(searchParams);
    const session = await getSession();
    const listings = await api.getMyListings(session?.user?.sub!, { PageNumber: Number(page), ...parsedSearchParams });

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/dashboard/my-listings?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardMyListingsContextProvider>
            <DashboardListHeader
                addNewButton={{ label: "New Advert", path: "/dashboard/new-listing" }}
                filter={<DashboardMyListFilterButton />}
                itemCount={listings.totalCount}
            />
            <DashboardMyListingsList basePath="/dashboard/my-listings" listings={listings} userClaims={session?.user} />
        </DashboardMyListingsContextProvider>
    );
}
