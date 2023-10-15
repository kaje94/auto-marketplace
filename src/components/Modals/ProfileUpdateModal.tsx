import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { editProfileAction } from "@/actions/profileActions";
import { Modal, ModalFooter } from "@/components/Common";
import { ProfileForm } from "@/components/Forms/Profile/ProfileForm";
import { UpdateProfileSchema } from "@/utils/schemas";
import { ListingUser, UpdateProfileReq } from "@/utils/types";

interface Props {
    onSuccess?: () => void;
    setVisible?: (visible: boolean) => void;
    userData: ListingUser;
    visible?: boolean;
}

export const ProfileUpdateModal = (props: Props) => {
    const { userData, visible, setVisible = () => {}, onSuccess = () => {} } = props;

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
        async (formValues: UpdateProfileReq) => {
            return editProfileAction(formValues);
        },
        {
            onSuccess,
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

    return (
        <>
            <Modal onVisibleChange={setVisible} title="Update Profile" visible={!!visible}>
                <form>
                    <ProfileForm
                        form={form}
                        gridClassnames="lg:!grid-cols-1"
                        isMutating={isMutating}
                        onMutate={(values) => updateSubscriptionMutation(values)}
                        showFooter={false}
                        showHeader={false}
                        userData={userData}
                        wrapClassnames="!p-0 !shadow-none"
                    />
                    <ModalFooter
                        loading={isMutating}
                        onSubmit={form.handleSubmit((values) => updateSubscriptionMutation(values))}
                        onVisibleChange={setVisible}
                        primaryButton={{ text: "Update" }}
                    />
                </form>
            </Modal>
        </>
    );
};
