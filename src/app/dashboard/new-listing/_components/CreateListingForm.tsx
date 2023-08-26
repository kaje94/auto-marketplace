"use client";
import { ListingForm } from "@/app/_components/ListingForm";
import { CreateListingReq, VehicleFeature } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { CreateListingSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { convertYearToDateString, getListingTitleFromVehicle, transformImagesToPost } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRef } from "react";
import { createListingAction } from "@/app/_actions/listingActions";
import { useSession } from "next-auth/react";

interface Props {
    features: VehicleFeature[];
}

export const CreateListingForm = (props: Props) => {
    const { features } = props;
    const router = useRouter();
    const session = useSession();

    const toastId = useRef<string>();

    const form = useForm<CreateListingReq>({
        resolver: zodResolver(CreateListingSchema),
        defaultValues: { vehicle: { vehicleImages: [], featureIds: [] } },
        mode: "all",
    });

    const { mutate: createListingsMutation, isLoading: isMutating } = useMutation(
        async (formValues: CreateListingReq) => {
            const vehicleImages = await transformImagesToPost(formValues.vehicle.vehicleImages);

            const requestBody: CreateListingReq = {
                ...formValues,
                vehicle: {
                    ...formValues.vehicle,
                    vehicleImages: vehicleImages,
                    yearOfManufacture: convertYearToDateString(formValues.vehicle.yearOfManufacture),
                    yearOfRegistration: convertYearToDateString(formValues.vehicle.yearOfRegistration),
                },
            };
            return createListingAction(requestBody, session?.data?.user?.id!);
        },
        {
            onSuccess: (id, req) => {
                if (window?.location?.pathname === `/dashboard/new-listing`) {
                    router.replace(`/dashboard/listings/${id}`);
                }
            },
            onMutate: (data) => {
                toastId.current = toast.loading(`Creating new Advert for ${getListingTitleFromVehicle(data.vehicle)}...`);
            },
            onSettled: (_data, err, variables) => {
                if (err) {
                    console.error("Failed to create advert", JSON.stringify(variables), err);
                    toast.error(`Failed to create advert for ${getListingTitleFromVehicle(variables.vehicle)}. ${(err as Error)?.message ?? ""}`, {
                        id: toastId?.current,
                    });
                } else {
                    toast.success(`Successfully created a new Advert for ${getListingTitleFromVehicle(variables.vehicle)}`, { id: toastId?.current });
                }
            },
        }
    );

    return (
        <ListingForm
            featureOptions={features}
            form={form}
            isMutating={isMutating}
            onMutate={createListingsMutation}
            submitButton={{ text: "Create", mutatingText: "Creating..." }}
        />
    );
};
