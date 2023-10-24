"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { COUNTRIES } from "@/utils/countries";
import { LabelValue } from "@/utils/types";
import { AutocompleteController } from "../FormElements/AutoComplete";

interface Props {
    currentLocale: string;
    setVisible: (visible: boolean) => void;
    visible: boolean;
}

export const CountrySelectModal = (props: Props) => {
    const { currentLocale, setVisible, visible } = props;
    const router = useRouter();
    const currentCountry = COUNTRIES[currentLocale]?.[0];

    const { handleSubmit, control, reset } = useForm<{ country: string }>({
        resolver: zodResolver(z.object({ country: z.string().min(1, "Country is required") })),
        defaultValues: { country: currentCountry },
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
        setVisible(false);
    };

    useEffect(() => {
        if (visible) {
            reset({ country: currentCountry });
        }
    }, [currentCountry, visible, reset]);

    return (
        <Modal onVisibleChange={setVisible} title="Switch Country" visible={visible}>
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
                    Switching your country lets you see vehicle availability in diverse locations, broadening your options for finding the perfect
                    vehicle.
                </div>
                <ModalFooter
                    onSubmit={handleSubmit((values) => handleLocaleChange(values.country))}
                    onVisibleChange={setVisible}
                    primaryButton={{ text: "Apply" }}
                />
            </form>
        </Modal>
    );
};
