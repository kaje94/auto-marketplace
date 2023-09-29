import { PlusIcon } from "@/icons";
import { FC, ReactNode } from "react";
import Link from "next/link";

interface Props {
    loading?: boolean;
    itemCount?: number;
    filter?: ReactNode;
    addNewButton?: {
        path: string;
        label: string;
    };
}

export const DashboardListHeader: FC<Props> = ({ itemCount = 0, loading, filter, addNewButton }) => {
    return (
        <div className="mb-3 mt-1 grid items-center gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-3 2xl:gap-8">
            <div className="col-span-1 text-sm font-light text-info-content 2xl:col-span-2">
                {loading ? <div className="h-5 w-28 animate-pulse bg-base-300" /> : `${itemCount} results found`}
            </div>

            <div className="col-span-1 flex flex-row-reverse items-center justify-between md:flex-row md:justify-end md:gap-2">
                {loading ? <div className="h-8 w-8 animate-pulse rounded bg-base-300" /> : <>{filter}</>}
                {addNewButton && (
                    <Link href={addNewButton?.path} className="flex h-full items-center">
                        <button className="btn-ghost btn-sm btn px-0 md:px-2">
                            <PlusIcon />
                            {addNewButton?.label}
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};
