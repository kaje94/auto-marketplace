"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { createListingAction } from "@/actions/listingActions";
import { ListingForm } from "@/components/Forms/Listings/ListingForm";
import { COUNTRIES } from "@/utils/countries";
import { convertYearToDateString, getDistanceUnit, getListingTitleFromVehicle } from "@/utils/helpers";
import { transformImagesToPost } from "@/utils/imageUtils";
import { CreateListingSchema } from "@/utils/schemas";
import { CreateListingReq, ListingUser, VehicleBrand, VehicleFeature } from "@/utils/types";

interface Props {
    brands: VehicleBrand[];
    features: VehicleFeature[];
    profile?: ListingUser;
    userId?: string;
}

export const CreateListingForm = (props: Props) => {
    const { features, userId, profile, brands } = props;
    const router = useRouter();
    const params = useParams();
    const toastId = useRef<string>();
    const countryItem = COUNTRIES[profile?.address?.country || ""];
    const distanceUnit = getDistanceUnit(profile?.address?.country);
    const countryCurrencyCode = countryItem?.[1];
    const countryCurrencySymbol = countryItem?.[2];

    const form = useForm<CreateListingReq>({
        resolver: zodResolver(CreateListingSchema),
        defaultValues: {
            vehicle: { vehicleImages: [], featureIds: [], millage: { unit: distanceUnit }, trim: "" },
            location: {
                city: profile?.address?.city || "",
                state: profile?.address?.state || "",
                postalCode: profile?.address?.postalCode || "",
                country: profile?.address?.country ? COUNTRIES[profile?.address?.country]?.[0] : COUNTRIES[params.locale as string]?.[0],
            },
            price: { currencyCode: countryCurrencyCode, currencySymbol: countryCurrencySymbol },
        },
        mode: "all",
    });

    const { mutate: createListingsMutation, isLoading: isMutating } = useMutation(
        async (formValues: CreateListingReq) => {
            const vehicleImages = await transformImagesToPost(formValues.vehicle.vehicleImages);

            const countryCode = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === formValues?.location?.country);

            const requestBody: CreateListingReq = {
                ...formValues,
                location: {
                    ...formValues.location,
                    country: countryCode!,
                },
                vehicle: {
                    ...formValues.vehicle,
                    vehicleImages: vehicleImages,
                    yearOfManufacture: convertYearToDateString(formValues.vehicle.yearOfManufacture),
                    yearOfRegistration: formValues.vehicle.yearOfRegistration
                        ? convertYearToDateString(formValues.vehicle.yearOfRegistration)
                        : undefined,
                },
            };
            return createListingAction(requestBody, userId!);
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
                        city: profile?.address?.city || "",
                        state: profile?.address?.state || "",
                        postalCode: profile?.address?.postalCode || "",
                        country: profile?.address?.country ? COUNTRIES[profile?.address?.country]?.[0] : "",
                    },
                    price: { currencyCode: countryCurrencyCode, currencySymbol: countryCurrencySymbol },
                    vehicle: { millage: { unit: distanceUnit } },
                },
                { keepValues: true },
            );
        }
    }, [profile, form, countryCurrencyCode, countryCurrencySymbol, distanceUnit]);

    return (
        <ListingForm
            featureOptions={features}
            form={form}
            isMutating={isMutating}
            profile={profile}
            submitButton={{ text: "Create", mutatingText: "Creating..." }}
            vehicleBrands={brands}
            onMutate={createListingsMutation}
        />
    );
};
