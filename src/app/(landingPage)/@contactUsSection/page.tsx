import { InputController } from "@/app/_components/FormElements/Input";
import { TextAreaController } from "@/app/_components/FormElements/TextArea";
import { displayFont } from "@/app/fonts";
import clsx from "clsx";
import Image from "next/image";

export default async function Page() {
    return (
        <section className="relative bg-base-200 py-12 md:py-20">
            <div className="container mx-auto w-full max-w-xl">
                <h3 className={clsx(displayFont.className, "mb-6 text-center text-2xl lg:text-4xl")}>Contact Us</h3>
                <div className="mb-4 flex flex-col gap-1 p-4">
                    <InputController placeholder="Name" label="Name" fieldName="name" inputClassNames="bg-white" />
                    <InputController placeholder="user@email.com" label="Email" fieldName="email" inputClassNames="bg-white" />
                    <TextAreaController placeholder="Your message..." label="Message" fieldName="message" textAreaClassNames="bg-white" />
                    <button className="btn-neutral btn mt-6 w-full">Submit</button>
                </div>
            </div>
            {["left-10 top-10", "right-10 top-10", "bottom-10 right-10", "bottom-10 left-10"].map((position) => (
                <Image
                    key={position}
                    src="/images/contact-us-illustration-1.png"
                    height={100}
                    width={100}
                    alt="contact-us-illustration"
                    className={clsx("absolute hidden lg:block", position)}
                    unoptimized
                />
            ))}
        </section>
    );
}
