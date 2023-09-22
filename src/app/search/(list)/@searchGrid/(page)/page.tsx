import { SearchParams } from "@/utils/types";
import { api } from "@/utils/api";
import { transformListingsListResponse } from "@/utils/helpers";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { redirect } from "next/navigation";
import qs from "query-string";
import { SearchGrid } from "@/app/_components/Search";

export default async function Page({ searchParams }: SearchParams) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = PostedListingsFilterSchema.parse(searchParams);
    const listings = transformListingsListResponse(await api.getPostedListings({ PageNumber: Number(page), PageSize: 12, ...parsedSearchParams }));

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/search?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }
    return <SearchGrid listings={listings} />;
}
