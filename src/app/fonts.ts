import { Montserrat, Righteous } from "next/font/google";

/** Standard font used throughout the webapp */
export const standardFont = Montserrat({
    subsets: ["cyrillic"],
});

/** Display font to make the text distinct and stand out */
export const displayFont = Righteous({
    weight: "400",
    subsets: ["latin-ext"],
});
