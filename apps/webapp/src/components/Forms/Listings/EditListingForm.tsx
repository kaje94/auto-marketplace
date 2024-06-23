"use client";
import { PartialMessage } from "@bufbuild/protobuf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ListingItem, UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { editListingAction } from "@/actions/userListingActions";
import { ListingForm } from "@/components/Forms/Listings/ListingForm";
import { COUNTRIES } from "@/utils/countries";
import { FuelTypes, TransmissionTypes, VehicleConditionTypes, VehicleTypes } from "@/utils/enum";
import { getDistanceUnit, getListingTitleFromListing, getListingTitleFromVehicle } from "@/utils/helpers";
import { transformImagesToPost } from "@/utils/imageUtils";
import { CreateListingSchema } from "@/utils/schemas";
import { CreateListingReq, EditListingReq } from "@/utils/types";

interface Props {
    listingItem: ListingItem;
    profile?: PartialMessage<UserProfile>;
    successRedirectPath: string;
}

export const EditListingForm: FC<Props> = (props) => {
    const { listingItem, successRedirectPath, profile } = props;
    const router = useRouter();
    const params = useParams();
    const toastId = useRef<string>();
    const countryItem = COUNTRIES[profile?.data?.countryCode || ""];
    const distanceUnit = getDistanceUnit(profile?.data?.countryCode);

    const form = useForm<CreateListingReq>({
        resolver: zodResolver(CreateListingSchema),
        defaultValues: {
            ...listingItem,
            location: {
                city: profile?.data?.city,
                state: profile?.data?.state,
                country: countryItem?.[0],
                postalCode: profile?.data?.postalCode,
            },
            description: listingItem.data?.description,
            price: {
                amount: listingItem.data?.price,
                isPriceNegotiable: listingItem?.data?.priceNegotiable,
            },
            vehicle: {
                brand: listingItem.data?.brand,
                model: listingItem?.data?.model,
                trim: listingItem?.data?.trim,
                condition: listingItem?.data?.condition as VehicleConditionTypes,
                engineCapacity: listingItem?.data?.engineCapacity,
                featureIds: listingItem?.data?.features,
                fuelType: listingItem?.data?.fuelType as FuelTypes,
                millage: {
                    distance: listingItem?.data?.mileage,
                    unit: getDistanceUnit(profile?.data?.countryCode),
                },
                transmission: listingItem?.data?.transmissionType as TransmissionTypes,
                type: listingItem?.data?.type as VehicleTypes,
                vehicleImages: listingItem?.data?.vehicleImages,
                // todo: check if this is working
                yearOfManufacture: new Date(listingItem?.data?.yearOfManufacture!, 0, 1).getFullYear().toString(),
                yearOfRegistration: listingItem?.data?.yearOfRegistration
                    ? new Date(listingItem?.data?.yearOfManufacture!, 0, 1).getFullYear().toString()
                    : undefined,
            },
        },
        mode: "all",
    });

    const { mutate: updateListingsMutation, isLoading: isMutating } = useMutation(
        async (formValues: EditListingReq) => {
            const vehicleImages = await transformImagesToPost(formValues.vehicle.vehicleImages);
            return editListingAction(
                {
                    id: listingItem.id,
                    data: {
                        type: formValues.vehicle.type,
                        brand: formValues.vehicle.brand,
                        trim: formValues.vehicle.trim,
                        model: formValues.vehicle.model,
                        yearOfManufacture: parseInt(formValues.vehicle.yearOfManufacture), // todo: check
                        yearOfRegistration: formValues.vehicle.yearOfRegistration ? parseInt(formValues.vehicle.yearOfRegistration) : 0, // todo: check
                        mileage:
                            typeof formValues.vehicle.millage.distance == "string"
                                ? parseInt(formValues.vehicle.millage.distance)
                                : formValues.vehicle.millage.distance,
                        engineCapacity:
                            typeof formValues.vehicle.engineCapacity == "string"
                                ? parseInt(formValues.vehicle.engineCapacity)
                                : formValues.vehicle.engineCapacity,
                        description: formValues.description,
                        condition: formValues.vehicle.condition,
                        transmissionType: formValues.vehicle.transmission,
                        fuelType: formValues.vehicle.fuelType,
                        features: formValues.vehicle.featureIds, // todo: should be feature names
                        vehicleImages: vehicleImages,
                        price: typeof formValues.price.amount === "string" ? parseInt(formValues.price.amount) : formValues.price.amount,
                        priceNegotiable: formValues.price.isPriceNegotiable,
                    },
                },
                listingItem.user!,
                profile?.email!,
            );
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
        if (form.reset && listingItem?.user?.email === profile?.email) {
            form.reset(
                {
                    location: {
                        city: profile?.data?.city || "",
                        state: profile?.data?.state || "",
                        postalCode: profile?.data?.postalCode || "",
                        country: profile?.data?.countryCode ? COUNTRIES[profile?.data?.countryCode]?.[0] : "", // check this
                    },
                    vehicle: { millage: { unit: distanceUnit } },
                },
                { keepValues: true },
            );
        }
    }, [profile, form, listingItem?.user?.email, profile?.email, distanceUnit]);

    return (
        <ListingForm
            form={form}
            isMutating={isMutating}
            isUpdateProfileEnabled={profile?.email === listingItem?.user?.email}
            profile={profile}
            submitButton={{ text: "Update", mutatingText: "Updating...", disableIfCleanForm: true }}
            title={getListingTitleFromListing(listingItem?.data!)}
            onMutate={(values) => updateListingsMutation({ ...values, listingId: listingItem.id })}
        />
    );
};
