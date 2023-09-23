import { DashboardListHeader } from "@/app/_components";
import { api } from "@/utils/api";
import { transformListingsListResponse } from "@/utils/helpers";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { DashboardAllListFilter } from "@/app/_components/DashboardListHeader/DashboardAllListFilter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { DashboardListingsContextProvider } from "@/providers/dashboard-listings-provider";
import { DashboardAllListingsList } from "@/app/_components/DashboardListings/DashboardListingsList";

const AllAds = async ({ searchParams }: SearchParams) => {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardListingFilterSchema.parse(searchParams);
    const session = await getServerSession(authOptions);
    const listings = transformListingsListResponse(await api.getListings({ PageNumber: Number(page), ...parsedSearchParams }));

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
};

export default AllAds;
