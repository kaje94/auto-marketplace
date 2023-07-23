"use client";
import { SearchIcon } from "@/icons";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import ClickAwayListener from "react-click-away-listener";

export const NavBarSearch = () => {
    const pathname = usePathname();
    const [isFocused, setIsFocused] = useState(false);
    const [searchVal, setSearchVal] = useState("");

    useEffect(() => {
        if (!isFocused) {
            setSearchVal("");
        }
    }, [isFocused]);

    if (["/", "/listing"].includes(pathname)) {
        return null;
    }

    return (
        <ClickAwayListener onClickAway={() => setIsFocused(false)}>
            <div className="relative hidden sm:block">
                <input
                    type="text"
                    placeholder="Search..."
                    className={clsx({
                        "input bg-transparent sm:block text-sm": true,
                        "input-bordered border-base-300 text-base-200 opacity-100": isFocused,
                        "opacity-0": !isFocused,
                    })}
                    onBlur={() => setIsFocused(false)}
                    onFocus={() => setIsFocused(true)}
                    value={searchVal}
                    onChange={(event) => setSearchVal(event.target.value)}
                />
                <button
                    className={clsx({
                        "btn absolute border-none right-0 top-0 rounded-l-none": true,
                        "text-secondary-content bg-base-300 hover:bg-base-100": isFocused,
                        "btn-ghost text-base-300 hover:text-accent bg-transparent": !isFocused,
                    })}
                    onClick={() => setIsFocused(true)}
                >
                    <SearchIcon />
                </button>
            </div>
        </ClickAwayListener>
    );
};
