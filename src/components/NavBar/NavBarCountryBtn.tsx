import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { CountrySelectModal } from "@/components/Modals/CountrySelectModal";
import { COUNTRIES } from "@/utils/countries";

export const NavBarCountryBtn = () => {
    const [CountrySelectModalVisible, setCountrySelectModalVisible] = useState(false);
    const params = useParams();
    const countryFlag = useMemo(() => COUNTRIES[params.locale as string]?.[4], [params.locale]);
    return (
        <>
            <button
                className="btn btn-square btn-neutral btn-sm opacity-60 hover:opacity-100"
                disabled={!countryFlag}
                onClick={() => setCountrySelectModalVisible(true)}
            >
                {countryFlag}
            </button>
            <CountrySelectModal
                currentLocale={params.locale as string}
                setVisible={setCountrySelectModalVisible}
                visible={CountrySelectModalVisible}
            />
        </>
    );
};
