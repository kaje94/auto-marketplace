"use client";
import { Session } from "@auth0/nextjs-auth0";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useReCaptcha } from "next-recaptcha-v3";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { submitContactUsFormAction } from "@/actions/contactUsActions";
import { validateRecaptchaAction } from "@/actions/recaptchaActions";
import { AlertCircleIcon, CheckIcon } from "@/icons";
import { ContactUsSchema } from "@/utils/schemas";
import { ContactUsSchemaReq } from "@/utils/types";
import { InputController } from "../../FormElements/Input";
import { TextAreaController } from "../../FormElements/TextArea";

/** Contact us form to be used in the contact us page */
export const ContactUsForm = ({ session }: { session?: Session | null }) => {
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
                toastId.current = toast.loading(`Submitting contact us form`);
            },
            onSettled: (_data, err) => {
                if (err) {
                    toast.error(`Failed to submit your message. Please try again in a while`, { id: toastId?.current });
                } else {
                    toast.success(`Successfully submitted your message. Our team will get in touch with you soon.`, { id: toastId?.current });
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
                        <div className="font-bold">Failed to submit form</div>
                        <div className="text-sm opacity-80">Oops, we encountered an unexpected error. Please try again in a while</div>
                    </div>
                </div>
            )}
            {status === "success" && (
                <div className="alert alert-success mb-5">
                    <CheckIcon />
                    <div>
                        <div className="font-bold">Successfully submitted your message</div>
                        <div className="text-sm opacity-80">Our team will get in touch with you soon</div>
                    </div>
                </div>
            )}
            <InputController
                control={control}
                disabled={!!session || submitted}
                fieldName="name"
                inputClassNames="bg-white"
                label="Name"
                placeholder="Name"
            />
            <InputController
                control={control}
                disabled={!!session || submitted}
                fieldName="email"
                inputClassNames="bg-white"
                label="Email"
                placeholder="user@email.com"
                type="email"
            />
            <InputController
                control={control}
                disabled={submitted}
                fieldName="subject"
                inputClassNames="bg-white"
                label="Subject"
                placeholder="Subject"
            />
            <TextAreaController
                control={control}
                disabled={submitted}
                fieldName="message"
                label="Message"
                placeholder="Your message..."
                textAreaClassNames="bg-white"
            />
            <button className="btn btn-neutral mt-6 w-full" disabled={isLoading || submitted} onClick={handleSubmit((values) => mutate(values))}>
                {isLoading ? "Submitting..." : "Submit"}
            </button>
        </form>
    );
};
