"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { editListingAction } from "@/actions/listingActions";
import { ListingForm } from "@/components/Forms/Listings/ListingForm";
import { COUNTRIES } from "@/utils/countries";
import { convertYearToDateString, getDistanceUnit, getListingTitleFromVehicle } from "@/utils/helpers";
import { transformImagesToPost } from "@/utils/imageUtils";
import { CreateListingSchema } from "@/utils/schemas";
import { CreateListingReq, EditListingReq, ListingItem, ListingUser, VehicleBrand, VehicleFeature } from "@/utils/types";

interface Props {
    brands: VehicleBrand[];
    features: VehicleFeature[];
    listingItem: ListingItem;
    profile?: ListingUser;
    successRedirectPath: string;
    userId?: string;
}

export const EditListingForm: FC<Props> = (props) => {
    const { features, listingItem, successRedirectPath, brands, profile, userId } = props;
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
            ...listingItem,
            location: {
                ...listingItem.location,
                country: listingItem.location?.country ? COUNTRIES[listingItem.location?.country]?.[0] : COUNTRIES[params.locale as string]?.[0],
            },
            vehicle: {
                ...listingItem.vehicle,
                yearOfManufacture: new Date(new Date(listingItem.vehicle.yearOfManufacture).getFullYear(), 0, 1).getFullYear().toString(),
                yearOfRegistration: listingItem.vehicle.yearOfRegistration
                    ? new Date(new Date(listingItem.vehicle.yearOfRegistration).getFullYear(), 0, 1).getFullYear().toString()
                    : undefined,
                featureIds: listingItem.vehicle.features.map((item) => item.id),
            },
        },
        mode: "all",
    });

    const { mutate: updateListingsMutation, isLoading: isMutating } = useMutation(
        async (formValues: EditListingReq) => {
            const vehicleImages = await transformImagesToPost(formValues.vehicle.vehicleImages);
            const countryCode = Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === formValues?.location?.country);

            const requestBody: EditListingReq = {
                ...formValues,
                listingId: listingItem.id,
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
            return editListingAction(requestBody, listingItem?.userId!);
        },
        {
            onSuccess: (_, req) => {
                if (
                    [
                        `/${params.locale}/dashboard/listings/edit/${req.listingId}`,
                        `/${params.locale}/dashboard/my-listings/edit/${req.listingId}`,
                    ].includes(window?.location?.pathname)
                ) {
                    router.replace(`/${params.locale}${successRedirectPath}/${req.listingId}`);
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

    useEffect(() => {
        if (form.reset && listingItem?.userId === userId) {
            form.reset(
                {
                    location: {
                        city: profile?.address?.city || "",
                        state: profile?.address?.state || "",
                        postalCode: profile?.address?.postalCode || "",
                        country: profile?.address?.country ? COUNTRIES[profile?.address?.country]?.[0] : "", // check this
                    },
                    price: { currencyCode: countryCurrencyCode, currencySymbol: countryCurrencySymbol },
                    vehicle: { millage: { unit: distanceUnit } },
                },
                { keepValues: true },
            );
        }
    }, [profile, form, listingItem?.userId, userId, countryCurrencyCode, distanceUnit, countryCurrencySymbol]);

    return (
        <ListingForm
            featureOptions={features}
            form={form}
            isMutating={isMutating}
            isUpdateProfileEnabled={userId === listingItem?.userId}
            profile={profile}
            submitButton={{ text: "Update", mutatingText: "Updating...", disableIfCleanForm: true }}
            title={listingItem?.title}
            vehicleBrands={brands}
            onMutate={(values) => updateListingsMutation({ ...values, listingId: listingItem.id })}
        />
    );
};
