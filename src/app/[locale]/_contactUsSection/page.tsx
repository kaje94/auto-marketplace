import { clsx } from "clsx";
import Image from "next/image";
import { displayFont } from "@/app/fonts";
import { InputController } from "@/components/FormElements/Input";
import { TextAreaController } from "@/components/FormElements/TextArea";

export default async function Page() {
    return (
        <section className="relative bg-base-200 py-12 md:py-20">
            <div className="container mx-auto w-full max-w-xl">
                <h3 className={clsx(displayFont.className, "mb-6 text-center text-2xl lg:text-4xl")}>Contact Us</h3>
                <div className="mb-4 flex flex-col gap-1 p-4">
                    <InputController fieldName="name" inputClassNames="bg-white" label="Name" placeholder="Name" />
                    <InputController fieldName="email" inputClassNames="bg-white" label="Email" placeholder="user@email.com" />
                    <TextAreaController fieldName="message" label="Message" placeholder="Your message..." textAreaClassNames="bg-white" />
                    <button className="btn btn-neutral mt-6 w-full">Submit</button>
                </div>
            </div>
            {["left-10 top-10", "right-10 top-10", "bottom-10 right-10", "bottom-10 left-10"].map((position) => (
                <Image
                    key={position}
                    alt="contact-us-illustration"
                    className={clsx("absolute hidden lg:block", position)}
                    height={100}
                    src="/images/contact-us-illustration-1.webp"
                    unoptimized
                    width={100}
                />
            ))}
        </section>
    );
}
