import { redirect } from "next/navigation";
import qs from "query-string";
import { SearchGrid } from "@/components/Search";
import { api } from "@/utils/api";
import { transformListingsListResponse } from "@/utils/helpers";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { LocalePathParam, SearchParams } from "@/utils/types";

export default async function Page({ searchParams, params }: SearchParams & LocalePathParam) {
    const page = searchParams["PageNumber"] ?? "1";
    const parsedSearchParams = PostedListingsFilterSchema.parse(searchParams);
    const listings = transformListingsListResponse(await api.getPostedListings(params.locale, { PageNumber: Number(page), PageSize: 12, ...parsedSearchParams }));

    if (listings.items?.length === 0 && page !== "1") {
        redirect(`/${params.locale}/search?${qs.stringify({ ...parsedSearchParams, PageNumber: 1 }, { skipEmptyString: true })}`);
    }
    return <SearchGrid listings={listings} />;
}
