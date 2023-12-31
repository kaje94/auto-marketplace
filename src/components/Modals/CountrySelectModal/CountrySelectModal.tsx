"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Modal, ModalFooter, ModalProps } from "@/components/Common/Modal";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { COUNTRIES } from "@/utils/countries";
import { LabelValue } from "@/utils/types";

interface Props extends ModalProps {
    /** The current locale. */
    currentLocale: string;
    /**
     * Callback function for when a new country is selected.
     * @param country The selected country.
     */
    onNewCountrySelect?: (country: string) => void;
    /** The country code that user is making the request from */
    originLocale?: string | null;
}

/** Modal to be used when user want to change the current country from the nav bar */
export const CountrySelectModal = (props: Props) => {
    const { currentLocale, onNewCountrySelect, onVisibleChange, visible, cancelable, originLocale, ...rest } = props;
    const router = useRouter();
    const currentCountry = COUNTRIES[currentLocale]?.[0];
    const originCountry = COUNTRIES[originLocale || ""]?.[0];

    const { handleSubmit, control, reset } = useForm<{ country: string }>({
        resolver: zodResolver(z.object({ country: z.string().min(1, "Country is required") })),
        defaultValues: { country: currentCountry || originCountry },
        mode: "all",
    });

    const countryList: LabelValue[] = Object.keys(COUNTRIES).map((key) => ({
        label: COUNTRIES[key]?.[0]!,
        value: COUNTRIES[key]?.[0]!,
    }));

    const handleLocaleChange = (country: string) => {
        const locale = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === country);

        const pathWithNewLocale = window.location.pathname
            ?.split("/")
            .filter((item) => !!item)
            .map((item, index) => (index == 0 ? locale : item))
            .join("/");

        router.replace(`/${pathWithNewLocale}${window.location.search}`);
        toast.success(`Successfully switched to country ${country}`);
        onVisibleChange(false);
        if (locale && onNewCountrySelect) {
            onNewCountrySelect(locale);
        }
    };

    useEffect(() => {
        if (visible) {
            reset({ country: currentCountry });
        }
    }, [currentCountry, visible, reset]);

    return (
        <Modal
            cancelable={cancelable}
            title={currentCountry ? "Switch Country" : "Select Country"}
            visible={visible}
            onVisibleChange={onVisibleChange}
            {...rest}
        >
            <form className="grid gap-1">
                <AutocompleteController
                    control={control}
                    fieldName="country"
                    label="Country"
                    options={countryList}
                    placeholder="Select Country"
                    required
                />
                <div className="mb-24 mt-2 text-sm">
                    {currentCountry
                        ? "Switching your country lets you see vehicle availability in diverse locations, broadening your options for finding the perfect vehicle."
                        : "Browse and manage content within the selected country. You can always change this selection later on."}
                </div>
                <ModalFooter
                    primaryButton={{ text: currentCountry ? "Apply" : "Proceed" }}
                    showCancel={cancelable}
                    onSubmit={handleSubmit((values) => handleLocaleChange(values.country))}
                    onVisibleChange={onVisibleChange}
                />
            </form>
        </Modal>
    );
};
