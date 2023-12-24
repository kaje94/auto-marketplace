"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { editListingSubscriptionAction } from "@/actions/listingSubscriptionActions";
import { COUNTRIES } from "@/utils/countries";
import { convertYearToDateString, getDistanceUnit } from "@/utils/helpers";
import { CreateSubscriptionSchema } from "@/utils/schemas";
import { CreateSubscriptionReq, EditSubscriptionReq, ListingSubscriptionItem, VehicleBrand } from "@/utils/types";
import { SubscriptionForm } from "./SubscriptionForm";

interface Props {
    brands: VehicleBrand[];
    listingSubscriptionItem: ListingSubscriptionItem;
    successRedirectPath: string;
    userId?: string;
}

export const EditSubscriptionForm: FC<Props> = (props) => {
    const { listingSubscriptionItem, successRedirectPath, userId, brands } = props;
    const router = useRouter();
    const params = useParams();
    const countryItem = COUNTRIES[(params.locale as string) || ""];
    const distanceUnit = getDistanceUnit(params.locale as string);
    const countryCurrencyCode = countryItem?.[1];
    const countryCurrencySymbol = countryItem?.[2];

    const toastId = useRef<string>();

    const form = useForm<CreateSubscriptionReq>({
        resolver: zodResolver(CreateSubscriptionSchema),
        defaultValues: {
            ...listingSubscriptionItem,
            minYearOfManufacture: listingSubscriptionItem.minYearOfManufacture
                ? new Date(new Date(listingSubscriptionItem.minYearOfManufacture).getFullYear(), 0, 1).getFullYear().toString()
                : undefined,
            maxYearOfManufacture: listingSubscriptionItem.maxYearOfManufacture
                ? new Date(new Date(listingSubscriptionItem.maxYearOfManufacture).getFullYear(), 0, 1).getFullYear().toString()
                : undefined,
            minYearOfRegistration: listingSubscriptionItem.minYearOfRegistration
                ? new Date(new Date(listingSubscriptionItem.minYearOfRegistration).getFullYear(), 0, 1).getFullYear().toString()
                : undefined,
            maxYearOfRegistration: listingSubscriptionItem.maxYearOfRegistration
                ? new Date(new Date(listingSubscriptionItem.maxYearOfRegistration).getFullYear(), 0, 1).getFullYear().toString()
                : undefined,
            maxPrice: {
                currencyCode: countryCurrencyCode,
                currencySymbol: countryCurrencySymbol,
                amount: listingSubscriptionItem?.maxPrice?.amount || undefined,
            },
            minPrice: {
                currencyCode: countryCurrencyCode,
                currencySymbol: countryCurrencySymbol,
                amount: listingSubscriptionItem?.minPrice?.amount || undefined,
            },
            minMillage: { unit: distanceUnit, distance: listingSubscriptionItem?.minMillage?.distance || undefined },
            maxMillage: { unit: distanceUnit, distance: listingSubscriptionItem?.maxMillage?.distance || undefined },
        },
        mode: "all",
    });

    useEffect(() => {
        if (form?.reset && listingSubscriptionItem?.userId === userId) {
            form.reset(
                {
                    maxPrice: { currencyCode: countryCurrencyCode, currencySymbol: countryCurrencySymbol },
                    minPrice: { currencyCode: countryCurrencyCode, currencySymbol: countryCurrencySymbol },
                    minMillage: { unit: distanceUnit },
                    maxMillage: { unit: distanceUnit },
                },
                { keepValues: true },
            );
        }
    }, [form, countryItem, userId, listingSubscriptionItem, countryCurrencyCode, countryCurrencySymbol, distanceUnit]);

    const { mutate: updateSubscriptionMutation, isLoading: isMutating } = useMutation(
        async (formValues: EditSubscriptionReq) => {
            const requestBody: EditSubscriptionReq = {
                ...formValues,
                listingSubscriptionId: listingSubscriptionItem.id,
                subscriptionExpiryDate: new Date(formValues.subscriptionExpiryDate).toISOString(),
                minYearOfManufacture: formValues.minYearOfManufacture ? convertYearToDateString(formValues.minYearOfManufacture) : undefined,
                maxYearOfManufacture: formValues.maxYearOfManufacture ? convertYearToDateString(formValues.maxYearOfManufacture) : undefined,
                minYearOfRegistration: formValues.minYearOfRegistration ? convertYearToDateString(formValues.minYearOfRegistration) : undefined,
                maxYearOfRegistration: formValues.maxYearOfRegistration ? convertYearToDateString(formValues.maxYearOfRegistration) : undefined,
                maxPrice:
                    Number(formValues.maxPrice?.amount) > 0 ? { ...formValues.maxPrice, amount: Number(formValues.maxPrice?.amount) } : undefined,
                minPrice:
                    Number(formValues.minPrice?.amount) > 0 ? { ...formValues.minPrice, amount: Number(formValues.minPrice?.amount) } : undefined,
                brand: formValues?.brand || undefined,
                model: formValues?.model || undefined,
                trim: formValues?.trim || undefined,
                condition: formValues?.condition || undefined,
                maxMillage:
                    Number(formValues?.maxMillage?.distance) > 0
                        ? { unit: formValues.maxMillage?.unit!, distance: Number(formValues?.maxMillage?.distance) }
                        : undefined,
                minMillage:
                    Number(formValues?.minMillage?.distance) > 0
                        ? { unit: formValues.minMillage?.unit!, distance: Number(formValues?.minMillage?.distance) }
                        : undefined,
            };
            return editListingSubscriptionAction(requestBody, listingSubscriptionItem?.userId!);
        },
        {
            onSuccess: (_, req) => {
                if (
                    [
                        `/${params.locale}/dashboard/subscriptions/edit/${req.listingSubscriptionId}`,
                        `/${params.locale}/dashboard/my-subscriptions/edit/${req.listingSubscriptionId}`,
                    ].includes(window?.location?.pathname)
                ) {
                    router.replace(`/${params.locale}${successRedirectPath}`);
                }
            },
            onMutate: (data) => {
                toastId.current = toast.loading(`Updating the Subscription ${data.displayName}...`);
            },
            onSettled: (_, err, req) => {
                if (err) {
                    toast.error(`Failed to update the Subscription ${req.displayName}. ${(err as Error)?.message ?? ""}`, {
                        id: toastId?.current,
                    });
                } else {
                    toast.success(`Successfully updated the Subscription ${req.displayName}`, { id: toastId?.current });
                }
            },
        },
    );

    return (
        <SubscriptionForm
            countryCurrencySymbol={countryCurrencySymbol}
            distanceUnit={distanceUnit}
            form={form}
            isMutating={isMutating}
            submitButton={{ text: "Update", mutatingText: "Updating...", disableIfCleanForm: true }}
            vehicleBrands={brands}
            onMutate={(values) => updateSubscriptionMutation({ ...values, listingSubscriptionId: listingSubscriptionItem.id })}
        />
    );
};
