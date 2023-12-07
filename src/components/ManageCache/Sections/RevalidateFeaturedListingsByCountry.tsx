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

    const { mutate, isLoading } = useMutation(
        (req: RevalidateFeaturedListingsByCountryReq) => {
            const countryCode = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === req.country);
            return revalidateFeaturedListingsByCountryAction(countryCode!);
        },
        {
            onMutate: () => setModalVisible(false),
            onSuccess: () => toast.success(`Successfully revalidated featured listings`),
            onError: () => toast.error(`Failed to revalidate featured listings`),
        },
    );

    const countryList: LabelValue[] = Object.keys(COUNTRIES).map((key) => ({
        label: COUNTRIES[key]?.[0]!,
        value: COUNTRIES[key]?.[0]!,
    }));

    return (
        <>
            <button className="btn btn-outline" disabled={isLoading} onClick={() => setModalVisible(true)}>
                Revalidate featured listings by country
            </button>
            <Modal title="Revalidate featured listings by country" visible={!!modalVisible} onVisibleChange={setModalVisible}>
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
