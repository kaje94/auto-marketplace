import { PartialMessage } from "@bufbuild/protobuf";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { UserProfile, UserProfile_ProfileData } from "targabay-protos/gen/ts/dist/types/common_pb";
import { editProfileAction } from "@/actions/profileActions";
import { Modal, ModalFooter } from "@/components/Common";
import { ModalProps } from "@/components/Common/Modal";
import { ProfileForm } from "@/components/Forms/Profile/ProfileForm";
import { COUNTRIES } from "@/utils/countries";
import { UpdateProfileSchema } from "@/utils/schemas";
import { UpdateProfileReq } from "@/utils/types";

interface Props extends ModalProps {
    /**
     * Callback function to be called when the update is successful.
     * @param data - The updated user data.
     */
    onSuccess?: (data: PartialMessage<UserProfile>) => void;
    /** The user data to be displayed in the modal. */
    userData: PartialMessage<UserProfile>;
}

/** Modal to be used in onboarding modal and listing form to update user's details */
export const ProfileUpdateModal = (props: Props) => {
    const { userData, visible, onVisibleChange = () => {}, onSuccess = () => {} } = props;
    const params = useParams();

    const toastId = useRef<string>();

    const defaultValues = useMemo(
        () => ({
            address: {
                city: userData?.data?.city || "",
                state: userData?.data?.state || "",
                country: userData?.data?.countryCode ? COUNTRIES[userData?.data?.countryCode]?.[0] : COUNTRIES[params.locale as string]?.[0],
                postalCode: userData?.data?.postalCode || "",
            },
            isDealership: userData?.data?.vehicleDealer,
            phoneNumber: userData?.data?.phone,
        }),
        [userData, params.locale],
    );

    const form = useForm<UpdateProfileReq>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues,
        mode: "all",
    });

    const country = form.watch("address.country");

    const { mutate: updateSubscriptionMutation, isLoading: isMutating } = useMutation(
        async (formValues: UpdateProfileReq) => {
            await editProfileAction(
                {
                    city: formValues.address.city,
                    state: formValues.address.state,
                    postalCode: formValues.address.postalCode,
                    countryCode: Object.keys(COUNTRIES).find((item) => COUNTRIES[item]?.[0] === country)!,
                    phone: formValues.phoneNumber,
                    vehicleDealer: formValues.isDealership,
                },
                userData?.email!,
            );
        },
        {
            onSuccess: (data, variables) =>
                onSuccess({
                    ...userData,
                    data: {
                        city: variables.address.city,
                        state: variables.address.state,
                        postalCode: variables.address.postalCode,
                        countryCode: variables.address.country,
                        phone: variables.phoneNumber,
                        vehicleDealer: variables.isDealership,
                    } as UserProfile_ProfileData,
                }),
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

    useEffect(() => {
        if (visible) {
            form.reset(defaultValues);
        }
    }, [visible, form, defaultValues]);

    return (
        <>
            <Modal
                childrenClassnames="!p-0"
                modalClassnames="!max-w-3xl"
                title="Update Profile"
                visible={!!visible}
                onVisibleChange={onVisibleChange}
            >
                <div className="flex max-h-[80vh] flex-col ">
                    <div className="flex-1 overflow-auto px-4 py-2 lg:px-6">
                        <ProfileForm
                            form={form}
                            gridClassnames="lg:!grid-cols-1"
                            isMutating={isMutating}
                            locationSectionClassnames="lg:grid-cols-2"
                            showFooter={false}
                            showHeader={false}
                            userData={userData}
                            wrapClassnames="!p-0 !shadow-none"
                            onMutate={(values) => updateSubscriptionMutation(values)}
                        />
                    </div>
                    <div className="p-4 lg:p-6">
                        <ModalFooter
                            loading={isMutating}
                            primaryButton={{ text: "Update" }}
                            onSubmit={form.handleSubmit((values) => updateSubscriptionMutation(values))}
                            onVisibleChange={onVisibleChange}
                        />
                    </div>
                </div>
            </Modal>
        </>
    );
};
