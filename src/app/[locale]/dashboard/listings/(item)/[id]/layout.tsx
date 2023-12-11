import { Metadata } from "next";
import { getScopedI18n } from "@/locales/server";
import { ChildrenProps } from "@/utils/types";

export async function generateMetadata(): Promise<Metadata> {
    const tManageListingItem = await getScopedI18n("metadata.manageListingItem");
    const title = tManageListingItem("title");
    return { title };
}

export default function Layout({ children }: ChildrenProps) {
    return children;
}
