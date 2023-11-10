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
import { CreateSubscriptionReq, EditSubscriptionReq, ListingSubscriptionItem } from "@/utils/types";
import { SubscriptionForm } from "./SubscriptionForm";

interface Props {
    listingSubscriptionItem: ListingSubscriptionItem;
    successRedirectPath: string;
    userId?: string;
}

export const EditSubscriptionForm: FC<Props> = (props) => {
    const { listingSubscriptionItem, successRedirectPath, userId } = props;
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
            // todo: check update functionality once the backend API issues are fixed
            // vehicle: {
            //     ...listingItem.vehicle,
            //     yearOfManufacture: new Date(new Date(listingItem.vehicle.yearOfManufacture).getFullYear(), 0, 1).getFullYear().toString(),
            //     yearOfRegistration: new Date(new Date(listingItem.vehicle.yearOfRegistration).getFullYear(), 0, 1).getFullYear().toString(),
            //     featureIds: listingItem.vehicle.features.map((item) => item.id),
            // },
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
                maxPrice: formValues.maxPrice?.amount ? formValues.maxPrice : undefined,
                minPrice: formValues.minPrice?.amount ? formValues.minPrice : undefined,
                brand: formValues?.brand || undefined,
                model: formValues?.model || undefined,
                trim: formValues?.trim || undefined,
                condition: formValues?.condition || undefined,
                maxMillage: formValues?.maxMillage?.distance ? formValues.maxMillage : undefined,
                minMillage: formValues?.minMillage?.distance ? formValues.minMillage : undefined,
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
            onMutate={(values) => updateSubscriptionMutation({ ...values, listingSubscriptionId: listingSubscriptionItem.id })}
            submitButton={{ text: "Update", mutatingText: "Updating...", disableIfCleanForm: true }}
        />
    );
};
