"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { CountrySelectModal } from "@/components/Modals/CountrySelectModal";
import { useScopedI18n } from "@/locales/client";

export const ListingDetailsCountrySelectBtn = () => {
    const [CountrySelectModalVisible, setCountrySelectModalVisible] = useState(false);
    const params = useParams();
    const tListingDetails = useScopedI18n("components.listingDetails");

    return (
        <>
            <button className="btn btn-neutral" onClick={() => setCountrySelectModalVisible(true)}>
                {tListingDetails("changeCountryBtn")}
            </button>
            <CountrySelectModal
                currentLocale={params.locale as string}
                setVisible={setCountrySelectModalVisible}
                visible={CountrySelectModalVisible}
            />
        </>
    );
};
