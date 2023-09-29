"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FC, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { editListingAction } from "@/actions/listingActions";
import { ListingForm } from "@/components/Forms/Listings/ListingForm";
import { convertYearToDateString, getListingTitleFromVehicle, transformImagesToPost } from "@/utils/helpers";
import { CreateListingSchema } from "@/utils/schemas";
import { CreateListingReq, EditListingReq, ListingItem, VehicleFeature } from "@/utils/types";

interface Props {
    features: VehicleFeature[];
    listingItem: ListingItem;
    successRedirectPath: string;
}

export const EditListingForm: FC<Props> = (props) => {
    const { features, listingItem, successRedirectPath } = props;
    const router = useRouter();

    const toastId = useRef<string>();

    const form = useForm<CreateListingReq>({
        resolver: zodResolver(CreateListingSchema),
        defaultValues: {
            ...listingItem,
            vehicle: {
                ...listingItem.vehicle,
                yearOfManufacture: new Date(new Date(listingItem.vehicle.yearOfManufacture).getFullYear(), 0, 1).getFullYear().toString(),
                yearOfRegistration: new Date(new Date(listingItem.vehicle.yearOfRegistration).getFullYear(), 0, 1).getFullYear().toString(),
                featureIds: listingItem.vehicle.features.map((item) => item.id),
            },
        },
        mode: "all",
    });

    const { mutate: updateListingsMutation, isLoading: isMutating } = useMutation(
        async (formValues: EditListingReq) => {
            const vehicleImages = await transformImagesToPost(formValues.vehicle.vehicleImages);

            const requestBody: EditListingReq = {
                ...formValues,
                listingId: listingItem.id,
                vehicle: {
                    ...formValues.vehicle,
                    vehicleImages: vehicleImages,
                    yearOfManufacture: convertYearToDateString(formValues.vehicle.yearOfManufacture),
                    yearOfRegistration: convertYearToDateString(formValues.vehicle.yearOfRegistration),
                },
            };
            return editListingAction(requestBody, listingItem?.userId!);
        },
        {
            onSuccess: (_, req) => {
                if (
                    [`/dashboard/listings/edit/${req.listingId}`, `/dashboard/my-listings/edit/${req.listingId}`].includes(window?.location?.pathname)
                ) {
                    router.replace(`${successRedirectPath}/${req.listingId}`);
                }
            },
            onMutate: (data) => {
                toastId.current = toast.loading(`Updating the Advert ${getListingTitleFromVehicle(data.vehicle)}...`);
            },
            onSettled: (_, err, req) => {
                if (err) {
                    toast.error(`Failed to update the advert ${getListingTitleFromVehicle(req.vehicle)}. ${(err as Error)?.message ?? ""}`, {
                        id: toastId?.current,
                    });
                } else {
                    toast.success(`Successfully updated the Advert ${getListingTitleFromVehicle(req.vehicle)}`, { id: toastId?.current });
                }
            },
        },
    );

    return (
        <ListingForm
            featureOptions={features}
            form={form}
            isMutating={isMutating}
            onMutate={(values) => updateListingsMutation({ ...values, listingId: listingItem.id })}
            submitButton={{ text: "Update", mutatingText: "Updating...", disableIfCleanForm: true }}
            title={listingItem?.title}
        />
    );
};
