"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { revalidateFeaturedListingsByCountryAction } from "@/actions/cacheActions";
import { Modal, ModalFooter } from "@/components/Common";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { useScopedI18n } from "@/locales/client";
import { COUNTRIES } from "@/utils/countries";
import { LabelValue } from "@/utils/types";

const RevalidateFeaturedListingsByCountrySchema = z.object({ country: z.string() });

type RevalidateFeaturedListingsByCountryReq = z.infer<typeof RevalidateFeaturedListingsByCountrySchema>;

export const RevalidateFeaturedListingsByCountry = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const { handleSubmit, control } = useForm<RevalidateFeaturedListingsByCountryReq>({
        resolver: zodResolver(RevalidateFeaturedListingsByCountrySchema),
        mode: "all",
    });

    const tCommon = useScopedI18n("common");
    const tRevalidateAllFeaturedListings = useScopedI18n("components.manageCache.revalidateAllFeaturedListings");
    const tForm = useScopedI18n("form");

    const { mutate, isLoading } = useMutation(
        (req: RevalidateFeaturedListingsByCountryReq) => {
            const countryCode = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === req.country);
            return revalidateFeaturedListingsByCountryAction(countryCode!);
        },
        {
            onMutate: () => setModalVisible(false),
            onSuccess: () => toast.success(tRevalidateAllFeaturedListings("toast.success")),
            onError: () => toast.error(tRevalidateAllFeaturedListings("toast.error")),
        },
    );

    const countryList: LabelValue[] = Object.keys(COUNTRIES).map((key) => ({
        label: COUNTRIES[key]?.[0]!,
        value: COUNTRIES[key]?.[0]!,
    }));

    return (
        <>
            <button className="btn btn-outline" disabled={isLoading} onClick={() => setModalVisible(true)}>
                {tRevalidateAllFeaturedListings("buttonText")}
            </button>
            <Modal title={tRevalidateAllFeaturedListings("buttonText")} visible={!!modalVisible} onVisibleChange={setModalVisible}>
                <form className="grid gap-1">
                    <AutocompleteController
                        control={control}
                        fieldName="country"
                        label={tForm("country.label")}
                        options={countryList}
                        placeholder={tForm("country.placeholder")}
                        required
                    />
                    <div className="h-36" />
                    <ModalFooter
                        loading={isLoading}
                        primaryButton={{ text: tCommon("proceed") }}
                        onSubmit={handleSubmit((values) => mutate(values))}
                        onVisibleChange={setModalVisible}
                    />
                </form>
            </Modal>
        </>
    );
};
