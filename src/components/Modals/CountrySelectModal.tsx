"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { useScopedI18n } from "@/locales/client";
import { COUNTRIES } from "@/utils/countries";
import { LabelValue } from "@/utils/types";

interface Props {
    currentLocale: string;
    onNewCountrySelect?: (country: string) => void;
    setVisible: (visible: boolean) => void;
    visible: boolean;
}

export const CountrySelectModal = (props: Props) => {
    const { currentLocale, onNewCountrySelect, setVisible, visible } = props;
    const router = useRouter();
    const currentCountry = COUNTRIES[currentLocale]?.[0];

    const tCommon = useScopedI18n("common");
    const tForm = useScopedI18n("form");
    const tCountrySelectModal = useScopedI18n("components.modals.countrySelectModal");

    const { handleSubmit, control, reset } = useForm<{ country: string }>({
        resolver: zodResolver(z.object({ country: z.string().min(1, tCountrySelectModal("countryRequired")) })),
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
        toast.success(tCountrySelectModal("toast.success", { country }));
        setVisible(false);
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
        <Modal title={tCountrySelectModal("title")} visible={visible} onVisibleChange={setVisible}>
            <form className="grid gap-1">
                <AutocompleteController
                    control={control}
                    fieldName="country"
                    label={tForm("country.label")}
                    options={countryList}
                    placeholder={tForm("country.placeholder")}
                    required
                />
                <div className="mb-24 mt-2 text-sm">{tCountrySelectModal("desc")}</div>
                <ModalFooter
                    primaryButton={{ text: tCommon("apply") }}
                    onSubmit={handleSubmit((values) => handleLocaleChange(values.country))}
                    onVisibleChange={setVisible}
                />
            </form>
        </Modal>
    );
};
