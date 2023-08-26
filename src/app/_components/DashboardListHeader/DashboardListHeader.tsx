import { PlusIcon } from "@/icons";
import { FC } from "react";
import Link from "next/link";
import { DashboardMyListFilter } from "./DashboardMyListFilter";
import { DashboardAllListFilter } from "./DashboardAllListFilter";

interface Props {
    loading?: boolean;
    itemCount?: number;
    allAdsFilter?: boolean;
}

export const DashboardListHeader: FC<Props> = ({ itemCount = 0, loading, allAdsFilter }) => {
    return (
        <div className="mb-3 mt-1 grid items-center gap-4 md:grid-cols-2 xl:gap-7 2xl:grid-cols-3 2xl:gap-8">
            <div className="col-span-1 text-sm font-light text-info-content 2xl:col-span-2">
                {loading ? <div className="h-5 w-28 animate-pulse bg-base-300" /> : `${itemCount} results found`}
            </div>

            <div className="col-span-1 flex flex-row-reverse items-center justify-between md:flex-row md:justify-end md:gap-2">
                {loading ? (
                    <div className="h-8 w-8 animate-pulse bg-base-300" />
                ) : (
                    <>{allAdsFilter ? <DashboardAllListFilter loadingPage={loading} /> : <DashboardMyListFilter loadingPage={loading} />}</>
                )}
                <Link href="/dashboard/new-listing" className="flex h-full items-center">
                    <button className="btn-ghost btn-sm btn px-0 md:px-2">
                        <PlusIcon />
                        New Advert
                    </button>
                </Link>
            </div>
        </div>
    );
};
