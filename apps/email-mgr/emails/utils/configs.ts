import { TailwindConfig } from "@react-email/components";

export const baseUrl = "https://targabay.com";

export const tailwindConfig: TailwindConfig = {
    theme: {
        extend: {
            colors: { brand: "#000033", offwhite: "#F8F9FA" },
            spacing: { 0: "0px", 45: "45px" },
        },
    },
};