"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FC, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { editProfileAction } from "@/actions/profileActions";
import { UpdateProfileSchema } from "@/utils/schemas";
import { ListingUser, UpdateProfileReq } from "@/utils/types";
import { ProfileForm } from "./ProfileForm";

interface Props {
    successRedirectPath: string;
    userData: ListingUser;
}

export const EditProfileForm: FC<Props> = (props) => {
    const { userData, successRedirectPath } = props;
    const router = useRouter();

    const toastId = useRef<string>();

    const form = useForm<UpdateProfileReq>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            address: {
                city: userData?.address?.city || "",
                state: userData?.address?.state || "",
                country: userData?.address?.country || "LK",
                postalCode: userData?.address?.postalCode,
            },
            isDealership: userData.isDealership,
            phoneNumber: userData.phone,
            userId: userData.userId,
        },
        mode: "all",
    });

    const { mutate: updateSubscriptionMutation, isLoading: isMutating } = useMutation(
        async (formValues: UpdateProfileReq) => editProfileAction(formValues),
        {
            onSuccess: () => {
                if (window?.location?.pathname === "/dashboard/profile/edit") {
                    router.replace(successRedirectPath);
                }
            },
            onMutate: () => {
                toastId.current = toast.loading(`Updating the user profile...`);
            },
            onSettled: (_, err) => {
                if (err) {
                    toast.error(`Failed to update the user profile. ${(err as Error)?.message ?? ""}`, {
                        id: toastId?.current,
                    });
                } else {
                    toast.success(`Successfully updated the user profile`, { id: toastId?.current });
                }
            },
        },
    );

    return <ProfileForm form={form} isMutating={isMutating} onMutate={(values) => updateSubscriptionMutation(values)} userData={userData} />;
};
