"use client";
import { CreateSubscriptionReq, EditSubscriptionReq, ListingSubscriptionItem } from "@/utils/types";
import { useMutation } from "@tanstack/react-query";
import { CreateSubscriptionSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { convertYearToDateString } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FC, useRef } from "react";
import { editListingSubscriptionAction } from "@/actions/listingSubscriptionActions";
import { SubscriptionForm } from "./SubscriptionForm";

interface Props {
    listingSubscriptionItem: ListingSubscriptionItem;
    successRedirectPath: string;
}

export const EditSubscriptionForm: FC<Props> = (props) => {
    const { listingSubscriptionItem, successRedirectPath } = props;
    const router = useRouter();

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
                maxMillage: formValues?.maxMillage || undefined,
                minMillage: formValues.minMillage || undefined,
            };
            return editListingSubscriptionAction(requestBody, listingSubscriptionItem?.userId!);
        },
        {
            onSuccess: (_, req) => {
                if (
                    [
                        `/dashboard/subscriptions/edit/${req.listingSubscriptionId}`,
                        `/dashboard/my-subscriptions/edit/${req.listingSubscriptionId}`,
                    ].includes(window?.location?.pathname)
                ) {
                    router.replace(successRedirectPath);
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
        }
    );

    return (
        <SubscriptionForm
            form={form}
            isMutating={isMutating}
            onMutate={(values) => updateSubscriptionMutation({ ...values, listingSubscriptionId: listingSubscriptionItem.id })}
            submitButton={{ text: "Update", mutatingText: "Updating...", disableIfCleanForm: true }}
        />
    );
};
