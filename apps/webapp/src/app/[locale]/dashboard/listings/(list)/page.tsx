import { getSession } from "@auth0/nextjs-auth0/edge";
import { redirect } from "next/navigation";
import qs from "query-string";
import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardAllListFilterButton } from "@/components/Dashboard/DashboardListHeader/DashboardAllListFilterButton";
import { DashboardAllListingsList } from "@/components/Dashboard/DashboardListings/DashboardListingsList";
import { DashboardAllListingsContextProvider } from "@/providers/DashboardAllListingsContextProvider";
import { api } from "@/utils/api";
import { DashboardListingFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = DashboardListingFilterSchema.parse(searchParams);
    const [session, listings, brands] = await Promise.all([
        getSession(),
        api.getListings({ PageNumber: Number(page), ...parsedSearchParams }),
        api.getVehicleBrands(),
    ]);

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/dashboard/listings?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }

    return (
        <DashboardAllListingsContextProvider>
            <DashboardListHeader
                addNewButton={{ label: "New Advert", path: "/dashboard/new-listing" }}
                filter={<DashboardAllListFilterButton vehicleBrands={brands} />}
                itemCount={listings.totalCount}
            />
            <DashboardAllListingsList basePath="/dashboard/listings" listings={listings} userClaims={session?.user} />
        </DashboardAllListingsContextProvider>
    );
}
