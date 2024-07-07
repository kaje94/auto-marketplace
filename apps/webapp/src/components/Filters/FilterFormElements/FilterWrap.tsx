import { clsx } from "clsx";
import { FC, ReactNode } from "react";
import ClickAwayListener from "react-click-away-listener";

interface Props {
    children: ReactNode;
    dropdownOpen?: boolean;
    hasFilters?: boolean;
    isLoading?: boolean;
    onApplyFilterClick?: (event: React.BaseSyntheticEvent) => Promise<void> | undefined;
    onResetClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    setDropdownOpen: (val: boolean) => void;
}

export const FilterWrap: FC<Props> = ({ children, setDropdownOpen, onApplyFilterClick, isLoading, dropdownOpen, hasFilters, onResetClick }) => {
    if (!dropdownOpen) {
        return null;
    }
    return (
        <span className={clsx("dropdown dropdown-end absolute z-20 flex justify-end", dropdownOpen && "dropdown-open")}>
            <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
                <div className="menu dropdown-content rounded-box z-[1] w-max !overflow-visible rounded-tr-none border-2 border-base-300 bg-base-200 p-0 shadow-lg md:max-w-md">
                    <form className="flex flex-col" test-id="dashboard-filter">
                        <div className="flex items-center justify-between gap-2 p-2 md:p-3">
                            <div className="text-sm font-semibold">Filters</div>
                            {hasFilters && (
                                <button className="btn btn-accent btn-outline btn-xs" disabled={isLoading} onClick={onResetClick}>
                                    Reset Applied Filters
                                </button>
                            )}
                        </div>
                        <div className="grid max-h-96 grid-cols-1 gap-0.5 overflow-y-auto px-2 py-1 md:max-h-max md:grid-cols-2 md:gap-2 md:px-3">
                            {children}
                        </div>
                        <button
                            className="btn btn-neutral btn-sm btn-wide mx-2 mb-3 mt-6 place-self-center"
                            disabled={isLoading}
                            onClick={onApplyFilterClick}
                        >
                            {isLoading ? "Applying Filters..." : "Apply Filters"}
                        </button>
                    </form>
                </div>
            </ClickAwayListener>
        </span>
    );
};
