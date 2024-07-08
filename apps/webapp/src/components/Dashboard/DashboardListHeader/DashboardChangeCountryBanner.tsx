"use client";

import { useParams } from "next/navigation";
import { FC, useState } from "react";
import { CountrySelectModal } from "@/components/Modals/CountrySelectModal";
import { AlertCircleIcon } from "@/icons";

interface Props {
    userCountryName: string;
}

/** Change country banner to be shown within user dashboard */
export const DashboardChangeCountryBanner: FC<Props> = ({ userCountryName }) => {
    const [CountrySelectModalVisible, setCountrySelectModalVisible] = useState(false);
    const params = useParams();

    return (
        <>
            <div className="alert alert-warning mb-6 mt-4 shadow-lg md:mt-1">
                <AlertCircleIcon />
                <div>
                    <h3 className="font-bold">Invalid Country</h3>
                    <div className="text-xs">Please switch back to {userCountryName} in order to utilize the functionality provided by Targabay</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => setCountrySelectModalVisible(true)}>
                    Change Country
                </button>
            </div>
            <CountrySelectModal
                currentLocale={params.locale as string}
                visible={CountrySelectModalVisible}
                onVisibleChange={setCountrySelectModalVisible}
            />
        </>
    );
};
