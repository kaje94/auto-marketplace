import { EditIcon } from "@/icons";
import { ListingItem } from "@/utils/types";
import clsx from "clsx";
import { FC } from "react";
import Link from "next/link";

interface Props {
    listingItem: ListingItem;
    loading?: boolean;
    basePath?: string;
}

export const EditButton: FC<Props> = ({ listingItem, loading, basePath }) => {
    return (
        <Link href={`${basePath}/edit/${listingItem.id}`} className="col-span-2">
            <button tabIndex={0} className={clsx("btn-neutral btn-block btn gap-2", loading && "animate-pulse")} disabled={loading}>
                <EditIcon />
                Edit
            </button>
        </Link>
    );
};
