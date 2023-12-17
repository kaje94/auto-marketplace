import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { closeUserAccountAction } from "@/actions/profileActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";

interface Props {
    setVisible?: (visible: boolean) => void;
    userId: string;
    visible?: boolean;
}

export const CloseAccountModal = (props: Props) => {
    const { userId, visible, setVisible = () => {} } = props;
    const toastId = useRef<string>();
    const { mutate, isLoading } = useMutation(() => closeUserAccountAction(userId!), {
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(`Closing user account...`);
        },
        onSettled: (_data, err) => {
            setVisible(false);
            if (err) {
                toast.error(`Failed to closed user account. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
            } else {
                window?.localStorage?.removeItem(`user-onboard-shown-${userId}-v1`);
                toast.success(`Successfully closed user account`, { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal title="Close user account" titleClassNames="text-error" visible={!!visible} onVisibleChange={setVisible}>
                <div>Are you sure you want to close your account. This action will permanently delete your account and is not reversible</div>
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: "Close Account", classNames: "btn-error" }}
                    onSubmit={() => mutate()}
                    onVisibleChange={setVisible}
                />
            </Modal>
        </>
    );
};
