import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "next/navigation";
import qs from "query-string";
import { GetStatesResponse } from "targabay-protos/gen/ts/dist/types/locations_pb";
import { getStatesOfCountry } from "@/actions/locationActions";
import { getMyProfileAction } from "@/actions/profileActions";
import { getUserListingsAction } from "@/actions/userListingActions";
import { DashboardListHeader } from "@/components/Dashboard/DashboardListHeader";
import { DashboardChangeCountryBanner } from "@/components/Dashboard/DashboardListHeader/DashboardChangeCountryBanner";
import { DashboardMyListFilterButton } from "@/components/Dashboard/DashboardListHeader/DashboardMyListFilterButton";
import { DashboardMyListingsList } from "@/components/Dashboard/DashboardListings/DashboardListingsList";
import { DashboardMyListingsContextProvider } from "@/providers/DashboardMyListingsContextProvider";
import { BOT_LOCALE } from "@/utils/constants";
import { COUNTRIES } from "@/utils/countries";
import { PublicListingsFilterSchema, UserListingsFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1"; // change all PageNumber to `page`
    const publicFilters = PublicListingsFilterSchema.parse(searchParams);
    const userFilters = UserListingsFilterSchema.parse(searchParams);
    const session = await getSession();
    const userProfile = await getMyProfileAction(session?.user?.email!);

    const [listingsRes, statesRes] = await Promise.all([
        getUserListingsAction(
            {
                page: { pageNumber: Number(page), pageSize: 10 },
                filters: {
                    publicFilters: {
                        ...publicFilters,
                        state: publicFilters.state!,
                        city: publicFilters.city!,
                        countryCode: params.locale,
                        maxPrice: typeof publicFilters.maxPrice == "string" ? parseFloat(publicFilters.maxPrice) : 0,
                        minPrice: typeof publicFilters.minPrice == "string" ? parseFloat(publicFilters.minPrice) : 0,
                    },
                    userFilters: {
                        ...userFilters,
                        brand: userFilters.brand!,
                    },
                },
            },
            session?.user.email!,
        ),
        params.locale === BOT_LOCALE ? {} : getStatesOfCountry(params.locale),
    ]);

    if (listingsRes.items?.length === 0 && page !== "1") {
        redirect(
            `/${params.locale}/dashboard/my-listings?${qs.stringify({ ...publicFilters, ...userFilters, PageNumber: 1 }, { skipEmptyString: true })}`,
        );
    }

    const userCountry = COUNTRIES[userProfile?.data?.countryCode!];

    return (
        <DashboardMyListingsContextProvider>
            <DashboardListHeader
                addNewButton={{ label: "New Advert", path: "/dashboard/new-listing" }}
                filter={<DashboardMyListFilterButton countryCode={params.locale} states={(statesRes as GetStatesResponse)?.states} />}
                itemCount={listingsRes.page?.totalCount}
            />
            {userCountry && userProfile?.data?.countryCode !== params.locale && <DashboardChangeCountryBanner userCountryName={userCountry?.[0]} />}
            <DashboardMyListingsList
                basePath="/dashboard/my-listings"
                currentPageNumber={Number(page) || 1}
                listings={listingsRes.items}
                paginatedResponse={listingsRes.page}
                userClaims={session?.user}
            />
        </DashboardMyListingsContextProvider>
    );
}
