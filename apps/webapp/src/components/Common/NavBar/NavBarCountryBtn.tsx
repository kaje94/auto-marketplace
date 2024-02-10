import { useParams } from "next/navigation";
import { FC, useEffect, useMemo, useState } from "react";
import { CountrySelectModal } from "@/components/Modals/CountrySelectModal";
import { BOT_LOCALE } from "@/utils/constants";
import { COUNTRIES } from "@/utils/countries";

interface Props {
    /** The country code that user is making the request from */
    originLocale?: string | null;
}

/** Country select button shown in the nav bar */
export const NavBarCountryBtn: FC<Props> = ({ originLocale }) => {
    const params = useParams();
    const countryFlag = useMemo(() => COUNTRIES[params.locale as string]?.[4], [params.locale]);
    const countryNotSelected = params.locale === BOT_LOCALE;
    const [CountrySelectModalVisible, setCountrySelectModalVisible] = useState(countryNotSelected);
    const [selectedCountry, setSelectedCountry] = useState(params.locale);
    const loading = params.locale && params.locale !== selectedCountry;
    useEffect(() => setSelectedCountry(params.locale), [params.locale]);
    useEffect(() => setCountrySelectModalVisible(countryNotSelected), [countryNotSelected]);

    return (
        <>
            <button
                className="btn btn-square !btn-neutral btn-sm p-0 text-base opacity-95 hover:opacity-100"
                disabled={countryNotSelected || !!loading}
                onClick={() => setCountrySelectModalVisible(true)}
            >
                {loading ? <span className="loading loading-ring loading-xs" /> : countryFlag}
            </button>
            <CountrySelectModal
                cancelable={!countryNotSelected}
                currentLocale={params.locale as string}
                originLocale={originLocale}
                visible={CountrySelectModalVisible}
                onNewCountrySelect={(locale) => setSelectedCountry(locale)}
                onVisibleChange={setCountrySelectModalVisible}
            />
        </>
    );
};
