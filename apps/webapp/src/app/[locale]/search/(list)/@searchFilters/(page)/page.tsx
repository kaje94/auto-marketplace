import { GetStatesResponse } from "targabay-protos/gen/ts/dist/types/locations_pb";
import { getStatesOfCountry } from "@/actions/locationActions";
import { SearchFilters } from "@/components/Listings/PostedListingsSearchFilters";
import { BOT_LOCALE } from "@/utils/constants";
import { LocalePathParam } from "@/utils/types";

export default async function Page({ params }: LocalePathParam) {
    const statesRes = await (params.locale === BOT_LOCALE ? {} : getStatesOfCountry(params.locale));
    return <SearchFilters states={(statesRes as GetStatesResponse)?.states} />;
}
