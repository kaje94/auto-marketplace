import { SearchFilters } from "@/components/Listings/PostedListingsSearchFilters";
import { api } from "@/utils/api";
import { BOT_LOCALE } from "@/utils/constants";
import { LocalePathParam } from "@/utils/types";

export default async function Page({ params }: LocalePathParam) {
    const [brands, states] = await Promise.all([api.getVehicleBrands(), params.locale === BOT_LOCALE ? [] : api.getStates(params.locale)]);
    return <SearchFilters states={states} vehicleBrands={brands} />;
}
