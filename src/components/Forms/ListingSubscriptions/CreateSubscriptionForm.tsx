"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { createListingSubscriptionAction } from "@/actions/listingSubscriptionActions";
import { COUNTRIES } from "@/utils/countries";
import { convertYearToDateString, getDistanceUnit } from "@/utils/helpers";
import { CreateSubscriptionSchema } from "@/utils/schemas";
import { CreateSubscriptionReq, VehicleBrand } from "@/utils/types";
import { SubscriptionForm } from "./SubscriptionForm";

interface Props {
    brands: VehicleBrand[];
    userId?: string;
}

export const CreateSubscriptionForm = (props: Props) => {
    const { userId, brands } = props;
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
            maxPrice: { currencyCode: countryCurrencyCode, currencySymbol: countryCurrencySymbol },
            minPrice: { currencyCode: countryCurrencyCode, currencySymbol: countryCurrencySymbol },
            minMillage: { unit: distanceUnit },
            maxMillage: { unit: distanceUnit },
        },
        mode: "all",
    });

    useEffect(() => {
        if (form?.reset) {
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
    }, [form, countryItem, countryCurrencyCode, countryCurrencySymbol, distanceUnit]);

    const { mutate: createSubscriptionMutation, isLoading: isMutating } = useMutation(
        async (formValues: CreateSubscriptionReq) => {
            const requestBody: CreateSubscriptionReq = {
                ...formValues,
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

            return createListingSubscriptionAction(requestBody, userId!);
        },
        {
            onSuccess: () => {
                if (window?.location?.pathname === `/${params.locale}/dashboard/new-subscription`) {
                    router.replace(`/${params.locale}/dashboard/my-subscriptions`);
                }
            },
            onMutate: (data) => {
                toastId.current = toast.loading(`Creating new subscription ${data.displayName}...`);
            },
            onSettled: (_data, err, variables) => {
                if (err) {
                    console.error("Failed to create subscription", JSON.stringify(variables), err);
                    toast.error(`Failed to create subscription ${variables.displayName}. ${(err as Error)?.message ?? ""}`, {
                        id: toastId?.current,
                    });
                } else {
                    toast.success(`Successfully created a new subscription ${variables.displayName}`, { id: toastId?.current });
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
            submitButton={{ text: "Create", mutatingText: "Creating..." }}
            vehicleBrands={brands}
            onMutate={createSubscriptionMutation}
        />
    );
};
