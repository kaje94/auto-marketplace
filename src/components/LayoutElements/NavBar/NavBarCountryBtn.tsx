import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CountrySelectModal } from "@/components/Modals/CountrySelectModal";
import { COUNTRIES } from "@/utils/countries";

export const NavBarCountryBtn = () => {
    const [CountrySelectModalVisible, setCountrySelectModalVisible] = useState(false);
    const params = useParams();
    const countryFlag = useMemo(() => COUNTRIES[params.locale as string]?.[4], [params.locale]);
    const [selectedCountry, setSelectedCountry] = useState(params.locale);
    const loading = params.locale && params.locale !== selectedCountry;

    useEffect(() => setSelectedCountry(params.locale), [params.locale]);

    return (
        <>
            <button
                className="btn btn-square !btn-neutral btn-sm p-0 text-base opacity-95 hover:opacity-100"
                disabled={!countryFlag || !!loading}
                onClick={() => setCountrySelectModalVisible(true)}
            >
                {loading ? <span className="loading loading-ring loading-xs" /> : countryFlag}
            </button>
            <CountrySelectModal
                currentLocale={params.locale as string}
                setVisible={setCountrySelectModalVisible}
                visible={CountrySelectModalVisible}
                onNewCountrySelect={(locale) => setSelectedCountry(locale)}
            />
        </>
    );
};
