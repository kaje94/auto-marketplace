"use client";
import { PartialMessage } from "@bufbuild/protobuf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { createListingAction } from "@/actions/userListingActions";
import { ListingForm } from "@/components/Forms/Listings/ListingForm";
import { COUNTRIES } from "@/utils/countries";
import { getDistanceUnit, getListingTitleFromVehicle } from "@/utils/helpers";
import { transformImagesToPost } from "@/utils/imageUtils";
import { CreateListingSchema } from "@/utils/schemas";
import { CreateListingReq } from "@/utils/types";

interface Props {
    canCreate?: boolean;
    profile?: PartialMessage<UserProfile>;
}

export const CreateListingForm = (props: Props) => {
    const { profile, canCreate = true } = props;
    const router = useRouter();
    const params = useParams();
    const toastId = useRef<string>();
    const distanceUnit = getDistanceUnit(profile?.data?.countryCode);

    const form = useForm<CreateListingReq>({
        resolver: zodResolver(CreateListingSchema),
        defaultValues: {
            vehicle: { vehicleImages: [], featureIds: [], millage: { unit: distanceUnit }, trim: "" },
            location: {
                city: profile?.data?.city || "",
                state: profile?.data?.state || "",
                postalCode: profile?.data?.postalCode || "",
                country: profile?.data?.countryCode ? COUNTRIES[profile?.data?.countryCode]?.[0] : COUNTRIES[params.locale as string]?.[0],
            },
        },
        mode: "all",
    });

    const { mutate: createListingsMutation, isLoading: isMutating } = useMutation(
        async (formValues: CreateListingReq) => {
            const vehicleImages = await transformImagesToPost(formValues.vehicle.vehicleImages);

            return createListingAction(
                {
                    type: formValues.vehicle.type,
                    brand: formValues.vehicle.brand,
                    trim: formValues.vehicle.trim,
                    model: formValues.vehicle.model,
                    yearOfManufacture: parseInt(formValues.vehicle.yearOfManufacture),
                    yearOfRegistration: formValues.vehicle.yearOfRegistration ? parseInt(formValues.vehicle.yearOfRegistration) : 0,
                    mileage: typeof formValues.vehicle.millage.distance == "string" ? parseInt(formValues.vehicle.millage.distance) : 0,
                    engineCapacity: typeof formValues.vehicle.engineCapacity == "string" ? parseInt(formValues.vehicle.engineCapacity) : 0,
                    description: formValues.description,
                    condition: formValues.vehicle.condition,
                    transmissionType: formValues.vehicle.transmission,
                    fuelType: formValues.vehicle.fuelType,
                    features: formValues.vehicle.featureIds, // todo: should be feature names
                    vehicleImages: vehicleImages,
                    price: typeof formValues.price.amount === "string" ? parseInt(formValues.price.amount) : formValues.price.amount,
                    priceNegotiable: formValues.price.isPriceNegotiable,
                },
                profile!,
            );
        },
        {
            onSuccess: (id) => {
                if (window?.location?.pathname === `/${params.locale}/dashboard/new-listing`) {
                    router.replace(`/${params.locale}/dashboard/my-listings/${id}`);
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

    useEffect(() => {
        if (form.reset) {
            form.reset(
                {
                    location: {
                        city: profile?.data?.city || "",
                        state: profile?.data?.state || "",
                        postalCode: profile?.data?.postalCode || "",
                        country: profile?.data?.countryCode ? COUNTRIES[profile?.data?.countryCode]?.[0] : "",
                    },
                    vehicle: { millage: { unit: distanceUnit } },
                },
                { keepValues: true },
            );
        }
    }, [profile, form, distanceUnit]);

    return (
        <ListingForm
            canCreate={canCreate}
            form={form}
            isMutating={isMutating}
            profile={profile}
            submitButton={{ text: "Create", mutatingText: "Creating..." }}
            onMutate={createListingsMutation}
        />
    );
};
