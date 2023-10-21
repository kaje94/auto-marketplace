"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { createListingAction } from "@/actions/listingActions";
import { ListingForm } from "@/components/Forms/Listings/ListingForm";
import { convertYearToDateString, getListingTitleFromVehicle, transformImagesToPost } from "@/utils/helpers";
import { CreateListingSchema } from "@/utils/schemas";
import { CreateListingReq, ListingUser, VehicleFeature } from "@/utils/types";

interface Props {
    features: VehicleFeature[];
    profile?: ListingUser;
    userId?: string;
}

export const CreateListingForm = (props: Props) => {
    const { features, userId, profile } = props;
    const router = useRouter();

    const toastId = useRef<string>();

    const form = useForm<CreateListingReq>({
        resolver: zodResolver(CreateListingSchema),
        defaultValues: {
            vehicle: { vehicleImages: [], featureIds: [] },
            location: {
                city: profile?.address?.city || "",
                state: profile?.address?.state || "",
                postalCode: profile?.address?.postalCode || 0,
                country: profile?.address?.country || "LK",
            },
        },
        mode: "all",
    });

    useEffect(() => {
        form?.reset({
            location: {
                city: profile?.address?.city || "",
                state: profile?.address?.state || "",
                postalCode: profile?.address?.postalCode || 0,
                country: profile?.address?.country || "LK",
            },
        });
    }, [profile, form]);

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
            return createListingAction(requestBody, userId!);
        },
        {
            onSuccess: (id) => {
                if (window?.location?.pathname === "/dashboard/new-listing") {
                    router.replace(`/dashboard/my-listings/${id}`);
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
                    toast.success(
                        `Your advertisement, ${getListingTitleFromVehicle(
                            variables.vehicle,
                        )}, has been successfully submitted for review. We will notify you once the review process is complete.`,
                        { id: toastId?.current },
                    );
                }
            },
        },
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
