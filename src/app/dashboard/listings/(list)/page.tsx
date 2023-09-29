import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import qs from "query-string";
import { authOptions } from "@/auth/authConfig";
import { DashboardListHeader } from "@/components/DashboardListHeader";
import { DashboardAllListFilter } from "@/components/DashboardListHeader/DashboardAllListFilter";
import { DashboardAllListingsList } from "@/components/DashboardListings/DashboardListingsList";
import { DashboardListingsContextProvider } from "@/providers/dashboard-listings-provider";
import { api } from "@/utils/api";
import { transformListingsListResponse } from "@/utils/helpers";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import { SearchParams } from "@/utils/types";

export default async function Page({ searchParams }: SearchParams) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardListingFilterSchema.parse(searchParams);
    const [session, listings] = await Promise.all([
        getServerSession(authOptions),
        transformListingsListResponse(await api.getListings({ PageNumber: Number(page), ...parsedSearchParams })),
    ]);

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/dashboard/listings?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardListingsContextProvider>
            <DashboardListHeader
                itemCount={listings.totalCount}
                filter={<DashboardAllListFilter />}
                addNewButton={{ label: "New Advert", path: "/dashboard/new-listing" }}
            />
            <DashboardAllListingsList listings={listings} session={session} basePath="/dashboard/listings" />
        </DashboardListingsContextProvider>
    );
}
