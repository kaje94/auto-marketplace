"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useReCaptcha } from "next-recaptcha-v3";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { reportListingAction } from "@/actions/listingActions";
import { validateRecaptchaAction } from "@/actions/recaptchaActions";
import { Modal, ModalFooter } from "@/components/Common/Modal";
import { InputController } from "@/components/FormElements/Input";
import { SelectController } from "@/components/FormElements/Select";
import { TextAreaController } from "@/components/FormElements/TextArea";
import { useScopedI18n } from "@/locales/client";
import { ListingReportReasonList } from "@/utils/constants";
import { ListingReportReason } from "@/utils/enum";
import { ReportListingSchema } from "@/utils/schemas";
import { ListingIdType, ReportListingReq } from "@/utils/types";

interface Props {
    listingId?: ListingIdType;
    listingTitle?: string;
    setVisible?: (visible: boolean) => void;
    userEmail?: string | null;
    visible?: boolean;
}

export const ReportListingModal = ({ listingId, listingTitle, visible, userEmail, setVisible = () => {} }: Props) => {
    const { executeRecaptcha } = useReCaptcha();
    const toastId = useRef<string>();
    const defaultForm = useMemo<ReportListingReq>(
        () => ({ listingId: listingId!, message: "", reason: ListingReportReason.Spam, emailAddress: userEmail ?? "" }),
        [userEmail, listingId],
    );

    const { handleSubmit, reset, control } = useForm<ReportListingReq>({
        resolver: zodResolver(ReportListingSchema),
        defaultValues: defaultForm,
        mode: "all",
    });

    const tReportListingModal = useScopedI18n("components.modals.reportListingModal");
    const tForm = useScopedI18n("form");

    const { mutate, isLoading } = useMutation(
        async (req: ReportListingReq) => {
            const token = await executeRecaptcha("report_listing_form_submit");
            await validateRecaptchaAction(token);
            return reportListingAction(req);
        },
        {
            onMutate: () => {
                setVisible(false);
                toastId.current = toast.loading(tReportListingModal("toast.loading", { listingTitle }));
            },
            onSettled: (_data, err) => {
                setVisible(false);
                if (err) {
                    toast.error(tReportListingModal("toast.error", { listingTitle, error: (err as Error)?.message }), { id: toastId?.current });
                } else {
                    toast.success(tReportListingModal("toast.success", { listingTitle }), { id: toastId?.current });
                }
            },
        },
    );

    useEffect(() => {
        if (visible) {
            reset(defaultForm);
        }
    }, [visible, reset, defaultForm]);

    return (
        <Modal title={tReportListingModal("title")} titleClassNames="text-error" visible={!!visible} onVisibleChange={setVisible}>
            <form className="grid gap-1">
                <SelectController
                    control={control}
                    fieldName="status"
                    label={tReportListingModal("formReasonLabel")}
                    options={ListingReportReasonList}
                    selectablePlaceholder={false}
                    required
                />
                <InputController
                    control={control}
                    fieldName="emailAddress"
                    label={tForm("email.label")}
                    placeholder={tForm("email.placeholder")}
                    type="email"
                    required
                />
                <TextAreaController
                    control={control}
                    fieldName="message"
                    label={tForm("message.label")}
                    placeholder={tReportListingModal("formMessagePlaceholder")}
                    required
                />
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: tReportListingModal("reportBtnText") }}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    onVisibleChange={setVisible}
                />
            </form>
        </Modal>
    );
};
