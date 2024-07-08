import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useReCaptcha } from "next-recaptcha-v3";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { reportListingAction } from "@/actions/publicListingActions";
import { validateRecaptchaAction } from "@/actions/recaptchaActions";
import { Modal, ModalFooter, ModalProps } from "@/components/Common/Modal";
import { InputController } from "@/components/FormElements/Input";
import { SelectController } from "@/components/FormElements/Select";
import { TextAreaController } from "@/components/FormElements/TextArea";
import { ListingReportReasonList } from "@/utils/constants";
import { ListingReportReason } from "@/utils/enum";
import { ListingIdType } from "@/utils/types";

interface Props extends ModalProps {
    /** The ID of the listing that needs to be reported. */
    listingId?: ListingIdType;
    /** The title of the listing.  */
    listingTitle?: string;
    /** * The email of the user if he/she is logged in*/
    userEmail?: string | null;
}

const ReportListingSchema = z.object({
    reason: z.nativeEnum(ListingReportReason),
    emailAddress: z.string().email(),
    message: z.string().min(1, "A message is required"),
});

type ReportListingReq = z.infer<typeof ReportListingSchema>;

/** Modal to be used in order to report a listing */
export const ReportListingModal = ({ listingId, listingTitle, visible, userEmail, onVisibleChange = () => {} }: Props) => {
    const { executeRecaptcha } = useReCaptcha();
    const toastId = useRef<string>();
    const defaultForm = useMemo<ReportListingReq>(
        () => ({ listingId: listingId!, message: "", reason: ListingReportReason.Spam, emailAddress: userEmail ?? "" }),
        [userEmail, listingId],
    );

    const { handleSubmit, reset, control } = useForm({
        resolver: zodResolver(ReportListingSchema),
        defaultValues: defaultForm,
        mode: "all",
    });

    const { mutate, isLoading } = useMutation(
        async (req: ReportListingReq) => {
            const token = await executeRecaptcha("report_listing_form_submit");
            await validateRecaptchaAction(token);
            return reportListingAction(req.emailAddress, listingId!, req.message, req.reason);
        },
        {
            onMutate: () => {
                onVisibleChange(false);
                toastId.current = toast.loading(`Reporting advert ${listingTitle}...`);
            },
            onSettled: (_data, err) => {
                onVisibleChange(false);
                if (err) {
                    toast.error(`Failed to report advert ${listingTitle}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
                } else {
                    toast.success(`Successfully reported the Advert ${listingTitle}`, { id: toastId?.current });
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
        <Modal title="Report Advert" titleClassNames="text-error" visible={!!visible} onVisibleChange={onVisibleChange}>
            <form className="grid gap-1">
                <SelectController
                    control={control}
                    fieldName="status"
                    label="Reason"
                    options={ListingReportReasonList}
                    selectablePlaceholder={false}
                    required
                />
                <InputController control={control} fieldName="emailAddress" label="Email" placeholder="user@gmail.com" type="email" required />
                <TextAreaController
                    control={control}
                    fieldName="message"
                    label="Message"
                    placeholder="Additional details on why you are reporting this advert"
                    required
                />
                <ModalFooter
                    loading={isLoading}
                    primaryButton={{ text: "Report Advert" }}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    onVisibleChange={onVisibleChange}
                />
            </form>
        </Modal>
    );
};
