import { TailwindConfig } from "@react-email/components";

export const baseUrl = "https://targabay.com";

export const tailwindConfig: TailwindConfig = {
    theme: {
        extend: {
            colors: { brand: "#000033", offwhite: "#EDEDED", error: "#5E1C1C" },
            spacing: { 0: "0px" },
        },
    },
};
