"use client";
import { PartialMessage } from "@bufbuild/protobuf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { UserProfile } from "targabay-protos/gen/ts/dist/types/common_pb";
import { createSubscriptionAction } from "@/actions/userSubscriptionActions";
import { COUNTRIES } from "@/utils/countries";
import { getDistanceUnit } from "@/utils/helpers";
import { CreateSubscriptionSchema } from "@/utils/schemas";
import { CreateSubscriptionReq } from "@/utils/types";
import { SubscriptionForm } from "./SubscriptionForm";

interface Props {
    canCreate?: boolean;
    profile?: PartialMessage<UserProfile>;
    userEmail?: string;
}

export const CreateSubscriptionForm = (props: Props) => {
    const { userEmail, profile, canCreate = true } = props;
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
            return createSubscriptionAction(
                {
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
                userEmail!,
            );
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
            canCreate={canCreate}
            countryCurrencySymbol={countryCurrencySymbol}
            distanceUnit={distanceUnit}
            form={form}
            isMutating={isMutating}
            profile={profile}
            submitButton={{ text: "Create", mutatingText: "Creating..." }}
            onMutate={createSubscriptionMutation}
        />
    );
};
