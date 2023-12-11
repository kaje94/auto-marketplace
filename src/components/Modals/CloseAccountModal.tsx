"use client";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-hot-toast";
import { closeUserAccountAction } from "@/actions/profileActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { useScopedI18n } from "@/locales/client";

interface Props {
    setVisible?: (visible: boolean) => void;
    userId: string;
    visible?: boolean;
}

export const CloseAccountModal = (props: Props) => {
    const { userId, visible, setVisible = () => {} } = props;
    const toastId = useRef<string>();
    const tCloseAccountModal = useScopedI18n("components.modals.closeAccountModal");
    const { mutate, isLoading } = useMutation(() => closeUserAccountAction(userId!), {
        onMutate: () => {
            setVisible(false);
            toastId.current = toast.loading(tCloseAccountModal("toast.loading"));
        },
        onSettled: (_data, err) => {
            setVisible(false);
            if (err) {
                toast.error(tCloseAccountModal("toast.error", { error: (err as Error)?.message }), { id: toastId?.current });
            } else {
                window?.localStorage?.removeItem(`user-onboard-shown-${userId}-v1`);
                toast.success(tCloseAccountModal("toast.success"), { id: toastId?.current });
            }
        },
    });

    return (
        <>
            <Modal title={tCloseAccountModal("title")} titleClassNames="text-error" visible={!!visible} onVisibleChange={setVisible}>
                <div>{tCloseAccountModal("desc")}</div>
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: tCloseAccountModal("btnText"), classNames: "btn-error" }}
                    onSubmit={() => mutate()}
                    onVisibleChange={setVisible}
                />
            </Modal>
        </>
    );
};
