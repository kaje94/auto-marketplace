import { reportListingAction } from "@/app/_actions/listingActions";
import { Input, Modal, ModalFooter, Select, TextArea } from "@/app/_components";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { ListingIdType, ReportListingReq } from "@/utils/types";
import { ListingReportReasonList } from "@/utils/constants";
import { ListingReportReason } from "@/utils/enum";
import { ReportListingSchema } from "@/utils/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

interface Props {
    listingId?: ListingIdType;
    listingTitle?: string;
    visible?: boolean;
    setVisible?: (visible: boolean) => void;
}

export const ReportListingModal = ({ listingId, listingTitle, visible, setVisible = () => {} }: Props) => {
    const toastId = useRef<string>();
    const session = useSession();
    const defaultForm = useMemo<ReportListingReq>(
        () => ({ listingId: listingId!, message: "", reason: ListingReportReason.Spam, emailAddress: session.data?.user?.email ?? "" }),
        [session.data?.user, listingId]
    );

    const { formState, handleSubmit, register, reset } = useForm<ReportListingReq>({
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
                <Select
                    label="Reason"
                    selectablePlaceholder={false}
                    options={ListingReportReasonList}
                    error={formState.errors.reason?.message}
                    required
                    {...register("reason")}
                />
                <Input
                    label="Email"
                    placeholder="user@gmail.com"
                    error={formState.errors.emailAddress?.message}
                    required
                    type="email"
                    disabled={session.status === "authenticated" || session.status === "loading"}
                    {...register("emailAddress")}
                />
                <TextArea
                    label="Message"
                    placeholder="Additional details on why you are reporting this advert"
                    error={formState.errors.message?.message}
                    required
                    {...register("message")}
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
