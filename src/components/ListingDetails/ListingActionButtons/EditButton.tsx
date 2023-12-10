"use client";
import { clsx } from "clsx";
import { FC } from "react";
import { LinkWithLocale } from "@/components/Common";
import { EditIcon } from "@/icons";
import { useScopedI18n } from "@/locales/client";
import { ListingItem } from "@/utils/types";

interface Props {
    basePath?: string;
    listingItem: ListingItem;
    loading?: boolean;
}

export const EditButton: FC<Props> = ({ listingItem, loading, basePath }) => {
    const tCommon = useScopedI18n("common");
    return (
        <LinkWithLocale className="col-span-2" href={`${basePath}/edit/${listingItem.id}`}>
            <button className={clsx("btn btn-neutral btn-block gap-2", loading && "animate-pulse")} disabled={loading}>
                <EditIcon />
                {tCommon("edit")}
            </button>
        </LinkWithLocale>
    );
};
