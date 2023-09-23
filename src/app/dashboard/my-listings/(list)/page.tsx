import { DashboardListHeader } from "@/app/_components";
import { api } from "@/utils/api";
import { transformListingsListResponse } from "@/utils/helpers";
import { SearchParams } from "@/utils/types";
import { redirect } from "next/navigation";
import { MyListingsFilterSchema } from "@/utils/schemas";
import qs from "query-string";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/authConfig";
import { DashboardMyListFilter } from "@/app/_components/DashboardListHeader/DashboardMyListFilter";
import { DashboardMyListingsContextProvider } from "@/providers/dashboard-my-listings-provider";
import { DashboardMyListingsList } from "@/app/_components/DashboardListings/DashboardListingsList";

const MyAds = async ({ searchParams }: SearchParams) => {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = MyListingsFilterSchema.parse(searchParams);
    const session = await getServerSession(authOptions);
    const listings = transformListingsListResponse(await api.getMyListings(session?.user?.id!, { PageNumber: Number(page), ...parsedSearchParams }));

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/dashboard/my-listings?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardMyListingsContextProvider>
            <DashboardListHeader
                itemCount={listings.totalCount}
                filter={<DashboardMyListFilter />}
                addNewButton={{ label: "New Advert", path: "/dashboard/new-listing" }}
            />
            <DashboardMyListingsList listings={listings} session={session} basePath="/dashboard/my-listings" />
        </DashboardMyListingsContextProvider>
    );
};

export default MyAds;
