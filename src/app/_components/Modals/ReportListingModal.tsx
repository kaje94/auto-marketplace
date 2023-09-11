import { reportListingAction } from "@/app/_actions/listingActions";
import { Modal, ModalFooter } from "@/app/_components";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { ListingIdType, ReportListingReq } from "@/utils/types";
import { ListingReportReasonList } from "@/utils/constants";
import { ListingReportReason } from "@/utils/enum";
import { ReportListingSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { InputController } from "../FormElements/Input";
import { TextAreaController } from "../FormElements/TextArea";
import { SelectController } from "../FormElements/Select";

interface Props {
    listingId?: ListingIdType;
    listingTitle?: string;
    visible?: boolean;
    setVisible?: (visible: boolean) => void;
    userEmail?: string | null;
}

export const ReportListingModal = ({ listingId, listingTitle, visible, userEmail, setVisible = () => {} }: Props) => {
    const toastId = useRef<string>();
    const defaultForm = useMemo<ReportListingReq>(
        () => ({ listingId: listingId!, message: "", reason: ListingReportReason.Spam, emailAddress: userEmail ?? "" }),
        [userEmail, listingId]
    );

    const { formState, handleSubmit, register, reset, control } = useForm<ReportListingReq>({
        resolver: zodResolver(ReportListingSchema),
        defaultValues: defaultForm,
        mode: "all",
    });

    const { mutate, isLoading } = useMutation(
        (req: ReportListingReq) => {
            return reportListingAction(req);
        },
        {
            onMutate: () => {
                setVisible(false);
                toastId.current = toast.loading(`Reporting advert ${listingTitle}...`);
            },
            onSettled: (_data, err) => {
                setVisible(false);
                if (err) {
                    toast.error(`Failed to report advert ${listingTitle}. ${(err as Error)?.message ?? ""}`, { id: toastId?.current });
                } else {
                    toast.success(`Successfully reported the Advert ${listingTitle}`, { id: toastId?.current });
                }
            },
        }
    );

    useEffect(() => {
        if (visible) {
            reset(defaultForm);
        }
    }, [visible, reset, defaultForm]);

    return (
        <Modal visible={!!visible} onVisibleChange={setVisible} title="Report Advert" titleClassNames="text-error">
            <form className="grid gap-1">
                <SelectController
                    label="Reason"
                    selectablePlaceholder={false}
                    options={ListingReportReasonList}
                    required
                    control={control}
                    fieldName="status"
                />
                <InputController label="Email" placeholder="user@gmail.com" required type="email" fieldName="emailAddress" control={control} />
                <TextAreaController
                    label="Message"
                    placeholder="Additional details on why you are reporting this advert"
                    required
                    control={control}
                    fieldName="message"
                />
                <ModalFooter
                    primaryButton={{ text: "Report Advert" }}
                    onVisibleChange={setVisible}
                    onSubmit={handleSubmit((values) => mutate(values))}
                    loading={isLoading}
                />
            </form>
        </Modal>
    );
};
