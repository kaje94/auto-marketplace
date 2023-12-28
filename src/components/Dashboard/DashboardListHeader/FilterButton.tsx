import { clsx } from "clsx";
import { FC } from "react";
import { FilterIcon } from "@/icons";

interface Props {
    dropdownOpen: boolean;
    handleFilterOpen: (event: React.MouseEvent<HTMLLabelElement, MouseEvent>) => void;
    hasSearchParams: boolean;
    loading: boolean;
}

export const FilterButton: FC<Props> = ({ loading, hasSearchParams, dropdownOpen, handleFilterOpen }) => {
    return (
        <label className="flex flex-row items-center gap-2" data-testid="dashboard-filter" onClick={handleFilterOpen}>
            {hasSearchParams && <div className={clsx("badge badge-outline badge-md w-max", !loading && "cursor-pointer")}>Filters Applied</div>}
            {loading ? (
                <span className="loading loading-ring h-8 w-8" />
            ) : (
                <button
                    className={clsx({
                        "btn-square btn-sm btn transition-all duration-200": true,
                        "btn-ghost": !hasSearchParams,
                        "btn-neutral": hasSearchParams,
                        "btn-active rounded-br-none": dropdownOpen,
                    })}
                >
                    <FilterIcon />
                </button>
            )}
        </label>
    );
};

export const FilterButtonLoading: FC = () => {
    return (
        <label className="flex animate-pulse flex-row items-center gap-2" onClick={(event) => event.preventDefault()}>
            <button className="btn btn-square btn-sm cursor-progress opacity-40">
                <FilterIcon />
            </button>
        </label>
    );
};
