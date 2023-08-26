import { FilterIcon } from "@/icons";
import clsx from "clsx";
import { FC } from "react";

interface Props {
    loading: boolean;
    hasSearchParams: boolean;
    dropdownOpen: boolean;
    loadingPage: boolean;
    handleFilterOpen: (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => void;
}

export const FilterButton: FC<Props> = ({ loading, hasSearchParams, dropdownOpen, loadingPage, handleFilterOpen }) => {
    return (
        <label className="flex  flex-row items-center gap-2" onClick={handleFilterOpen}>
            {hasSearchParams && <div className={clsx("badge badge-outline badge-md", !loading && "cursor-pointer")}>Filters Applied</div>}
            {loading ? (
                <span className="loading loading-ring h-8 w-8" />
            ) : (
                <button
                    className={clsx({
                        "btn-square btn-sm btn": true,
                        "btn-ghost": !hasSearchParams,
                        "btn-neutral": hasSearchParams,
                        "btn-active": dropdownOpen,
                        "animate-pulse": loadingPage,
                    })}
                >
                    <FilterIcon />
                </button>
            )}
        </label>
    );
};
