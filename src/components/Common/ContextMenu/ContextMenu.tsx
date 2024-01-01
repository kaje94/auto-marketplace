"use client";
import { clsx } from "clsx";
import { FC, ReactNode, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { LinkWithLocale } from "@/components/Common/LinkWithLocale";
import { MenuIcon } from "@/icons";

export interface ContextMenuItemProp {
    /** String of classnames for an item in the context menu */
    classNames?: string;
    /**The icon element for the context menu item */
    icon: ReactNode;
    /** The label text for the context menu item */
    label: string;
    /** The link URL for the context menu item */
    link?: string;
    /** The click event handler for the context menu item */
    onClick?: () => void;
}

interface Props {
    /** Items within the context menu */
    menuItems: ContextMenuItemProp[];
}

/** Placeholder component to show while context menu is hydrated */
export const ContextMenuLoading: FC = () => {
    return (
        <span className="animate-pulse cursor-progress" onClick={(event) => event.preventDefault()}>
            <MenuIcon className="opacity-40" />
        </span>
    );
};

/** Context menu to be used throughout the app */
export const ContextMenu: FC<Props> = ({ menuItems = [] }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    return (
        <>
            <MenuIcon
                className="cursor-pointer opacity-30 transition-all duration-200 hover:opacity-75 hover:shadow"
                data-testid="context-menu"
                onClick={(event) => {
                    event.preventDefault();
                    setMenuVisible(true);
                }}
            />
            <ClickAwayListener onClickAway={() => setMenuVisible(false)}>
                <div className={clsx("dropdown dropdown-end", menuVisible && "dropdown-open")}>
                    <ul
                        className="menu dropdown-content rounded-box z-[1] mr-2 mt-6 w-52 rounded-tr-none bg-base-200 p-2 shadow-lg"
                        onClick={() => setMenuVisible(false)}
                    >
                        {menuItems?.map((item) => <MenuItem key={item.label} {...item} />)}
                    </ul>
                </div>
            </ClickAwayListener>
        </>
    );
};

const MenuItem: FC<ContextMenuItemProp> = ({ link, label, icon, onClick, classNames }) => {
    return (
        <li>
            {link ? (
                <LinkWithLocale className="flex" data-testid={`context-menu-${label}`} href={link}>
                    <div className={clsx("flex flex-1 items-center justify-between font-medium", classNames)}>
                        {label}
                        {icon}
                    </div>
                </LinkWithLocale>
            ) : (
                <div
                    className={clsx("flex flex-1 items-center justify-between font-medium", classNames)}
                    data-testid={`context-menu-${label}`}
                    onClick={(event) => {
                        event.preventDefault();
                        if (onClick) {
                            onClick();
                        }
                    }}
                >
                    {label}
                    {icon}
                </div>
            )}
        </li>
    );
};
