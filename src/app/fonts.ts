import { Montserrat, Righteous } from "next/font/google";

// todo: rename as display and standard fonts

export const montserratFont = Montserrat({
    subsets: ["cyrillic"],
});

export const righteousFont = Righteous({
    weight: "400",
    subsets: ["latin-ext"],
});
