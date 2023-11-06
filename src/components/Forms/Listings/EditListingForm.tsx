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
import { convertYearToDateString, getDistanceUnit, getListingTitleFromVehicle, transformImagesToPost } from "@/utils/helpers";
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
                    yearOfRegistration: convertYearToDateString(formValues.vehicle.yearOfRegistration),
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
            const countryItem = COUNTRIES[profile?.address?.country || ""];
            const distanceUnit = getDistanceUnit(profile?.address?.country);
            form.reset({
                location: {
                    city: profile?.address?.city || "",
                    state: profile?.address?.state || "",
                    postalCode: profile?.address?.postalCode || "",
                    country: profile?.address?.country ? COUNTRIES[profile?.address?.country]?.[0] : "",
                },
                price: { currencyCode: countryItem?.[1], currencySymbol: countryItem?.[2] },
                vehicle: { millage: { unit: distanceUnit } },
            });
        }
    }, [profile, form]);

    return (
        <ListingForm
            featureOptions={features}
            form={form}
            isMutating={isMutating}
            isUpdateProfileEnabled={userId === listingItem?.userId}
            listingUser={
                userId === listingItem?.userId
                    ? { email: profile?.email, phoneNumber: profile?.phone, phoneCountryCode: COUNTRIES[profile?.address?.country || ""]?.[3] }
                    : {
                          email: listingItem?.user?.email,
                          phoneNumber: listingItem?.user?.phone,
                          phoneCountryCode: COUNTRIES[listingItem?.user?.address?.country || ""]?.[3],
                      }
            }
            onMutate={(values) => updateListingsMutation({ ...values, listingId: listingItem.id })}
            profile={profile}
            submitButton={{ text: "Update", mutatingText: "Updating...", disableIfCleanForm: true }}
            title={listingItem?.title}
            vehicleBrands={brands}
        />
    );
};
