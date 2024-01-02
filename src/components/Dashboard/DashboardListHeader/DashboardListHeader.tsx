import { FC, ReactNode } from "react";
import { LinkWithLocale } from "@/components/Common";
import { PlusIcon } from "@/icons";

interface Props {
    addNewButton?: {
        label: string;
        path: string;
    };
    filter?: ReactNode;
    itemCount?: number;
    loading?: boolean;
}

/** Dashboard listing header that contains the filter, item count and create new button */
export const DashboardListHeader: FC<Props> = ({ itemCount = 0, loading, filter, addNewButton }) => {
    return (
        <div className="mb-3 mt-1 grid items-center gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-3 2xl:gap-8">
            <div className="col-span-1 text-sm font-light text-info-content 2xl:col-span-2">
                {loading ? <div className="h-5 w-28 animate-pulse bg-base-300" /> : `${itemCount} results found`}
            </div>

            <div className="col-span-1 flex flex-row-reverse items-center justify-between md:flex-row md:justify-end md:gap-2">
                {loading ? <div className="h-8 w-8 animate-pulse rounded bg-base-300" /> : <>{filter}</>}
                {addNewButton && (
                    <LinkWithLocale className="flex h-full items-center" href={addNewButton?.path}>
                        <button className="btn btn-ghost btn-sm px-0 md:px-2">
                            <PlusIcon />
                            {addNewButton?.label}
                        </button>
                    </LinkWithLocale>
                )}
            </div>
        </div>
    );
};
