"use client";
import { Session } from "@auth0/nextjs-auth0/edge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useReCaptcha } from "next-recaptcha-v3";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { submitContactUsFormAction } from "@/actions/contactUsActions";
import { validateRecaptchaAction } from "@/actions/recaptchaActions";
import { AlertCircleIcon, CheckIcon } from "@/icons";
import { useScopedI18n } from "@/locales/client";
import { ContactUsSchema } from "@/utils/schemas";
import { ContactUsSchemaReq } from "@/utils/types";
import { InputController } from "../FormElements/Input";
import { TextAreaController } from "../FormElements/TextArea";

export const ContactUsForm = ({ session }: { session?: Session | null }) => {
    const tContactUsForm = useScopedI18n("components.contactUsForm");
    const tForm = useScopedI18n("form");

    const { executeRecaptcha } = useReCaptcha();
    const toastId = useRef<string>();

    const { handleSubmit, control } = useForm<ContactUsSchemaReq>({
        resolver: zodResolver(ContactUsSchema),
        defaultValues: { email: session?.user?.email ?? "", name: session?.user?.name ?? "" },
        mode: "all",
    });

    const { mutate, isLoading, status } = useMutation(
        async (reqParams: ContactUsSchemaReq) => {
            const token = await executeRecaptcha("contact_us_form_submit");
            await validateRecaptchaAction(token);
            await submitContactUsFormAction(reqParams);
        },
        {
            onMutate: () => {
                toastId.current = toast.loading(tContactUsForm("toast.loading"));
            },
            onSettled: (_data, err) => {
                if (err) {
                    toast.error(tContactUsForm("toast.error"), { id: toastId?.current });
                } else {
                    toast.success(tContactUsForm("toast.success"), { id: toastId?.current });
                }
            },
        },
    );

    const submitted = status === "error" || status === "success";

    return (
        <form className="my-4 flex flex-col gap-1">
            {status === "error" && (
                <div className="alert alert-error mb-5">
                    <AlertCircleIcon />
                    <div>
                        <div className="font-bold">{tContactUsForm("banner.error.title")}</div>
                        <div className="text-sm opacity-80">{tContactUsForm("banner.error.subTitle")}</div>
                    </div>
                </div>
            )}
            {status === "success" && (
                <div className="alert alert-success mb-5">
                    <CheckIcon />
                    <div>
                        <div className="font-bold">{tContactUsForm("banner.success.title")}</div>
                        <div className="text-sm opacity-80">{tContactUsForm("banner.success.subTitle")}</div>
                    </div>
                </div>
            )}
            <InputController
                control={control}
                disabled={!!session || submitted}
                fieldName="name"
                inputClassNames="bg-white"
                label={tForm("name.label")}
                placeholder={tForm("name.placeholder")}
            />
            <InputController
                control={control}
                disabled={!!session || submitted}
                fieldName="email"
                inputClassNames="bg-white"
                label={tForm("email.label")}
                placeholder={tForm("email.placeholder")}
                type="email"
            />
            <InputController
                control={control}
                disabled={submitted}
                fieldName="subject"
                inputClassNames="bg-white"
                label={tForm("subject.label")}
                placeholder={tForm("subject.placeholder")}
            />
            <TextAreaController
                control={control}
                disabled={submitted}
                fieldName="message"
                label={tForm("message.label")}
                placeholder={tForm("message.placeholder")}
                textAreaClassNames="bg-white"
            />
            <button className="btn btn-neutral mt-6 w-full" disabled={isLoading || submitted} onClick={handleSubmit((values) => mutate(values))}>
                {isLoading ? tForm("buttons.submit.loading") : tForm("buttons.submit.label")}
            </button>
        </form>
    );
};
