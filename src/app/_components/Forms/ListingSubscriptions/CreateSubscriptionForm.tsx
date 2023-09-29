"use client";
import { CreateSubscriptionReq } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { CreateSubscriptionSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRef } from "react";
import { createListingSubscriptionAction } from "@/actions/listingSubscriptionActions";
import { SubscriptionForm } from "./SubscriptionForm";
import { convertYearToDateString } from "@/utils/helpers";

interface Props {
    userId?: string;
}

export const CreateSubscriptionForm = (props: Props) => {
    const { userId } = props;
    const router = useRouter();

    const toastId = useRef<string>();

    const form = useForm<CreateSubscriptionReq>({
        resolver: zodResolver(CreateSubscriptionSchema),
        defaultValues: {},
        mode: "all",
    });

    const { mutate: createSubscriptionMutation, isLoading: isMutating } = useMutation(
        async (formValues: CreateSubscriptionReq) => {
            const requestBody: CreateSubscriptionReq = {
                ...formValues,
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
                maxMillage: formValues?.maxMillage || undefined,
                minMillage: formValues.minMillage || undefined,
            };

            return createListingSubscriptionAction(requestBody, userId!);
        },
        {
            onSuccess: () => {
                if (window?.location?.pathname === "/dashboard/new-subscription") {
                    router.replace(`/dashboard/my-subscriptions`);
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
        }
    );

    return (
        <SubscriptionForm
            form={form}
            isMutating={isMutating}
            onMutate={createSubscriptionMutation}
            submitButton={{ text: "Create", mutatingText: "Creating..." }}
        />
    );
};
