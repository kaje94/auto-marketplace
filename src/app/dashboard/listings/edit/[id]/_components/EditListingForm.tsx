"use client";
import { ListingForm } from "@/app/_components/ListingForm";
import { CreateListingReq, EditListingReq, ListingItem, VehicleFeature } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { CreateListingSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { convertYearToDateString, transformImagesToPost, getListingTitleFromVehicle } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRef } from "react";
import { editListingAction } from "@/app/_actions/listingActions";

interface Props {
    features: VehicleFeature[];
    listingItem: ListingItem;
}

export const EditListingForm = (props: Props) => {
    const { features, listingItem } = props;
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
                if (window?.location?.pathname === `/dashboard/listings/edit/${req.listingId}`) {
                    router.replace(`/dashboard/listings/${req.listingId}`);
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
        }
    );

    return (
        <ListingForm
            featureOptions={features}
            form={form}
            isMutating={isMutating}
            onMutate={(values) => updateListingsMutation({ ...values, listingId: listingItem.id })}
            submitButton={{ text: "Update", mutatingText: "Updating...", disableIfCleanForm: true }}
        />
    );
};
