import { SearchFilters } from "@/components/Search";
import { api } from "@/utils/api";
import { LocalePathParam } from "@/utils/types";

export default async function Page({ params }: LocalePathParam) {
    const [brands, states] = await Promise.all([api.getVehicleBrands(), api.getStates(params.locale)])
    return <SearchFilters vehicleBrands={brands} states={states}/>;
}
