"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { CountrySelectModal } from "@/components/Modals/CountrySelectModal";

export const ListingDetailsCountrySelectBtn = () => {
    const [CountrySelectModalVisible, setCountrySelectModalVisible] = useState(false);
    const params = useParams();

    return (
        <>
            <button className="btn btn-neutral" onClick={() => setCountrySelectModalVisible(true)}>
                Change Country
            </button>
            <CountrySelectModal
                currentLocale={params.locale as string}
                visible={CountrySelectModalVisible}
                onVisibleChange={setCountrySelectModalVisible}
            />
        </>
    );
};
