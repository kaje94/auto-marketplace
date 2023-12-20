import { SearchFilters } from "@/components/Listings/PostedListingsSearchFilters";
import { api } from "@/utils/api";
import { LocalePathParam } from "@/utils/types";

export default async function Page({ params }: LocalePathParam) {
    const [brands, states] = await Promise.all([api.getVehicleBrands(), api.getStates(params.locale)]);
    return <SearchFilters states={states} vehicleBrands={brands} />;
}
