"use client";
import { PartialMessage } from "@bufbuild/protobuf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { SubscriptionItem, UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { updateSubscriptionAction } from "@/actions/userSubscriptionActions";
import { COUNTRIES } from "@/utils/countries";
import { SubscriptionFrequencies, VehicleConditionTypes, VehicleTypes } from "@/utils/enum";
import { getDistanceUnit } from "@/utils/helpers";
import { CreateSubscriptionSchema } from "@/utils/schemas";
import { CreateSubscriptionReq, EditSubscriptionReq } from "@/utils/types";
import { SubscriptionForm } from "./SubscriptionForm";

interface Props {
    profile?: PartialMessage<UserProfile>;
    subscriptionItem: SubscriptionItem;
    successRedirectPath: string;
    userEmail?: string;
}

export const EditSubscriptionForm: FC<Props> = (props) => {
    const { subscriptionItem, successRedirectPath, userEmail, profile } = props;
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
            brand: subscriptionItem.data?.brand,
            condition: subscriptionItem.data?.condition as VehicleConditionTypes,
            displayName: subscriptionItem.data?.displayName,
            model: subscriptionItem.data?.model,
            trim: subscriptionItem.data?.trim,
            notificationFrequency: subscriptionItem.data?.notificationFrequency as SubscriptionFrequencies,
            subscriptionExpiryDate: subscriptionItem.data?.subscriptionExpiryDate,
            type: subscriptionItem.data?.type as VehicleTypes,

            minYearOfManufacture: subscriptionItem.data?.minYearOfManufacture
                ? new Date(new Date(subscriptionItem.data?.minYearOfManufacture).getFullYear(), 0, 1).getFullYear().toString()
                : undefined,
            maxYearOfManufacture: subscriptionItem.data?.maxYearOfManufacture
                ? new Date(new Date(subscriptionItem.data?.maxYearOfManufacture).getFullYear(), 0, 1).getFullYear().toString()
                : undefined,
            minYearOfRegistration: subscriptionItem.data?.minYearOfRegistration
                ? new Date(new Date(subscriptionItem.data?.minYearOfRegistration).getFullYear(), 0, 1).getFullYear().toString()
                : undefined,
            maxYearOfRegistration: subscriptionItem.data?.maxYearOfRegistration
                ? new Date(new Date(subscriptionItem.data?.maxYearOfRegistration).getFullYear(), 0, 1).getFullYear().toString()
                : undefined,
            maxPrice: {
                currencyCode: countryCurrencyCode,
                currencySymbol: countryCurrencySymbol,
                amount: subscriptionItem.data?.maxPrice || undefined,
            },
            minPrice: {
                currencyCode: countryCurrencyCode,
                currencySymbol: countryCurrencySymbol,
                amount: subscriptionItem.data?.minPrice || undefined,
            },
            minMillage: { unit: distanceUnit, distance: subscriptionItem.data?.minMillage || undefined },
            maxMillage: { unit: distanceUnit, distance: subscriptionItem.data?.maxMillage || undefined },
        },
        mode: "all",
    });

    useEffect(() => {
        if (form?.reset && subscriptionItem?.user?.email === userEmail) {
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
    }, [form, countryItem, userEmail, subscriptionItem, countryCurrencyCode, countryCurrencySymbol, distanceUnit]);

    const { mutate: updateSubscriptionMutation, isLoading: isMutating } = useMutation(
        async (formValues: EditSubscriptionReq) => {
            return updateSubscriptionAction(
                {
                    data: {
                        displayName: formValues.displayName,
                        notificationFrequency: formValues.notificationFrequency,
                        type: formValues.type,
                        subscriptionExpiryDate: new Date(formValues.subscriptionExpiryDate).toISOString(),
                        minYearOfManufacture: formValues.minYearOfManufacture ? parseInt(formValues.minYearOfManufacture) : 0,
                        maxYearOfManufacture: formValues.maxYearOfManufacture ? parseInt(formValues.maxYearOfManufacture) : 0,
                        minYearOfRegistration: formValues.minYearOfRegistration ? parseInt(formValues.minYearOfRegistration) : 0,
                        maxYearOfRegistration: formValues.maxYearOfRegistration ? parseInt(formValues.maxYearOfRegistration) : 0,
                        maxPrice: Number(formValues.maxPrice?.amount),
                        minPrice: Number(formValues.minPrice?.amount),
                        brand: formValues?.brand!,
                        model: formValues?.model || undefined,
                        trim: formValues?.trim || undefined,
                        condition: formValues?.condition || undefined,
                        maxMillage: Number(formValues?.maxMillage?.distance),
                        minMillage: Number(formValues?.minMillage?.distance),
                    },
                    id: subscriptionItem.id,
                },
                subscriptionItem?.user?.email!,
            );
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
            profile={profile}
            submitButton={{ text: "Update", mutatingText: "Updating...", disableIfCleanForm: true }}
            onMutate={(values) => updateSubscriptionMutation({ ...values, listingSubscriptionId: subscriptionItem.id })}
        />
    );
};
