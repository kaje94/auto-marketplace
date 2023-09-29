import { clsx } from "clsx";
import Link from "next/link";
import { FC } from "react";
import { EditIcon } from "@/icons";
import { ListingItem } from "@/utils/types";

interface Props {
    basePath?: string;
    listingItem: ListingItem;
    loading?: boolean;
}

export const EditButton: FC<Props> = ({ listingItem, loading, basePath }) => {
    return (
        <Link className="col-span-2" href={`${basePath}/edit/${listingItem.id}`}>
            <button className={clsx("btn-neutral btn-block btn gap-2", loading && "animate-pulse")} disabled={loading}>
                <EditIcon />
                Edit
            </button>
        </Link>
    );
};
