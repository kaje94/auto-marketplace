import { Montserrat, Righteous } from "next/font/google";

export const standardFont = Montserrat({
    subsets: ["cyrillic"],
});

export const displayFont = Righteous({
    weight: "400",
    subsets: ["latin-ext"],
});
