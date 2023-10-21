import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import qs from "query-string";
import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardAllListFilter } from "@/components/DashboardListHeader/DashboardAllListFilter";
import { DashboardAllListingsList } from "@/components/DashboardListings/DashboardListingsList";
import { DashboardListingsContextProvider } from "@/providers/dashboard-listings-provider";
import { api } from "@/utils/api";
import { transformListingsListResponse } from "@/utils/helpers";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardListingFilterSchema.parse(searchParams);
    const [session, listings] = await Promise.all([
        getSession(),
        transformListingsListResponse(await api.getListings({ PageNumber: Number(page), ...parsedSearchParams })),
    ]);

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/dashboard/listings?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardListingsContextProvider>
            <DashboardListHeader
                addNewButton={{ label: "New Advert", path: "/dashboard/new-listing" }}
                filter={<DashboardAllListFilter />}
                itemCount={listings.totalCount}
            />
            <DashboardAllListingsList basePath="/dashboard/listings" listings={listings} userClaims={session?.user} />
        </DashboardListingsContextProvider>
    );
}
