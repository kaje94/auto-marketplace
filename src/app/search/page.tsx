import { api } from "@/utils/api";
import { transformListingsListResponse } from "@/utils/helpers";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { SearchParams } from "@/utils/types";
import qs from "query-string";
import { redirect } from "next/navigation";
import { SearchScreen } from "../_screens/SearchScreen";

const ListingPage = async ({ searchParams }: SearchParams) => {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = PostedListingsFilterSchema.parse(searchParams);
    const listings = transformListingsListResponse(await api.getPostedListings({ PageNumber: Number(page), PageSize: 12, ...parsedSearchParams }));

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/search?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }
    return <SearchScreen listings={listings} searchParams={searchParams} />;
};

export default ListingPage;
