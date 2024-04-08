import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import qs from "query-string";
import { getAllListingsAction } from "@/actions/adminListingActions";
import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardAllListFilterButton } from "@/components/Dashboard/DashboardListHeader/DashboardAllListFilterButton";
import { DashboardAllListingsList } from "@/components/Dashboard/DashboardListings/DashboardListingsList";
import { DashboardAllListingsContextProvider } from "@/providers/DashboardAllListingsContextProvider";
import { AdminListingsFilterSchema, PublicListingsFilterSchema, UserListingsFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const publicFilters = PublicListingsFilterSchema.parse(searchParams);
    const userFilters = UserListingsFilterSchema.parse(searchParams);
    const adminFilters = AdminListingsFilterSchema.parse(searchParams);

    const [session, listingsRes] = await Promise.all([
        getSession(),
        getAllListingsAction({
            page: { pageNumber: Number(page), pageSize: 10 },
            filters: {
                publicFilters: {
                    ...publicFilters,
                    state: publicFilters.state!,
                    city: publicFilters.city!,
                    maxPrice: typeof publicFilters.maxPrice == "string" ? parseFloat(publicFilters.maxPrice) : 0,
                    minPrice: typeof publicFilters.minPrice == "string" ? parseFloat(publicFilters.minPrice) : 0,
                },
                userFilters: {
                    ...userFilters,
                    brand: userFilters.brand!,
                },
                adminFilters,
            },
        }),
    ]);

    if (listingsRes.items?.length === 0 && page !== "1") {
        redirect(
            `/${params.locale}/dashboard/listings?${qs.stringify({ ...publicFilters, ...userFilters, ...adminFilters, PageNumber: 1 }, { skipEmptyString: true })}`,
        );
    }

    return (
        <DashboardAllListingsContextProvider>
            <DashboardListHeader
                addNewButton={{ label: "New Advert", path: "/dashboard/new-listing" }}
                filter={<DashboardAllListFilterButton />}
                itemCount={listingsRes.page?.totalCount}
            />
            <DashboardAllListingsList
                basePath="/dashboard/listings"
                currentPageNumber={Number(page) || 1}
                listings={listingsRes.items}
                paginatedResponse={listingsRes.page}
                userClaims={session?.user}
            />
        </DashboardAllListingsContextProvider>
    );
}
