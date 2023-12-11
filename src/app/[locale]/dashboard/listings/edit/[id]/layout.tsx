import { Metadata } from "next";
import { getScopedI18n } from "@/locales/server";
import { ChildrenProps } from "@/utils/types";

export async function generateMetadata(): Promise<Metadata> {
    const tEditListing = await getScopedI18n("metadata.editListing");
    const title = tEditListing("title");
    return { title };
}

export default function Layout({ children }: ChildrenProps) {
    return children;
}
