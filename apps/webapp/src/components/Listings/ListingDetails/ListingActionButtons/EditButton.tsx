import { clsx } from "clsx";
import { FC } from "react";
import { ListingItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import { LinkWithLocale } from "@/components/Common";
import { EditIcon } from "@/icons";

interface Props {
    basePath?: string;
    listingItem: ListingItem;
    loading?: boolean;
}

export const EditButton: FC<Props> = ({ listingItem, loading, basePath }) => {
    return (
        <LinkWithLocale href={`${basePath}/edit/${listingItem.id}`}>
            <button className={clsx("btn btn-neutral  btn-block gap-2", loading && "animate-pulse")} disabled={loading}>
                <EditIcon />
                Edit
            </button>
        </LinkWithLocale>
    );
};
