"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { revalidatePosedListingsByCountryAction } from "@/actions/cacheActions";
import { Modal, ModalFooter } from "@/components/Common";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { COUNTRIES } from "@/utils/countries";
import { LabelValue } from "@/utils/types";

const RevalidatePostedListingsByCountrySchema = z.object({ country: z.string() });

type RevalidatePostedListingsByCountryReq = z.infer<typeof RevalidatePostedListingsByCountrySchema>;

export const RevalidatePostedListingsByCountry = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const params = useParams();
    const currentCountry = COUNTRIES[params.locale as string]?.[0];

    const { handleSubmit, control } = useForm<RevalidatePostedListingsByCountryReq>({
        resolver: zodResolver(RevalidatePostedListingsByCountrySchema),
        mode: "all",
        defaultValues: { country: currentCountry },
    });

    const { mutate, isLoading } = useMutation(
        (req: RevalidatePostedListingsByCountryReq) => {
            const countryCode = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === req.country);
            return revalidatePosedListingsByCountryAction(countryCode!);
        },
        {
            onMutate: () => setModalVisible(false),
            onSuccess: () => toast.success(`Successfully revalidated posted listings`),
            onError: () => toast.error(`Failed to revalidate posted listings`),
        },
    );

    const countryList: LabelValue[] = Object.keys(COUNTRIES).map((key) => ({
        label: COUNTRIES[key]?.[0]!,
        value: COUNTRIES[key]?.[0]!,
    }));

    return (
        <>
            <button className="btn btn-outline" disabled={isLoading} onClick={() => setModalVisible(true)}>
                Revalidate posted listings by country
            </button>
            <Modal title="Revalidate posted listings by country" visible={!!modalVisible} onVisibleChange={setModalVisible}>
                <form className="grid gap-1">
                    <AutocompleteController
                        control={control}
                        fieldName="country"
                        label="Country"
                        options={countryList}
                        placeholder="Select Country"
                        required
                    />
                    <div className="h-36" />
                    <ModalFooter
                        loading={isLoading}
                        primaryButton={{ text: "Proceed" }}
                        onSubmit={handleSubmit((values) => mutate(values))}
                        onVisibleChange={setModalVisible}
                    />
                </form>
            </Modal>
        </>
    );
};
