"use client";
import { clsx } from "clsx";
import { FC, ReactNode, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import { MenuIcon } from "@/icons";
import { LinkWithLocale } from "../LinkWithLocale";

export interface ContextMenuItemProp {
    classNames?: string;
    icon: ReactNode;
    label: string;
    link?: string;
    onClick?: () => void;
}

interface Props {
    menuItems: ContextMenuItemProp[];
}

export const ContextMenuLoading: FC = () => {
    return <MenuIcon className="animate-pulse cursor-progress opacity-10" />;
};

export const ContextMenu: FC<Props> = ({ menuItems = [] }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    return (
        <>
            <MenuIcon
                className="cursor-pointer opacity-30 transition-all duration-200 hover:opacity-75 hover:shadow"
                onClick={(event) => {
                    event.preventDefault();
                    setMenuVisible(true);
                }}
            />
            <ClickAwayListener onClickAway={() => setMenuVisible(false)}>
                <div className={clsx("dropdown-end dropdown", menuVisible && "dropdown-open")}>
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
                <LinkWithLocale className="flex" href={link}>
                    <div className={clsx("flex flex-1 items-center justify-between font-medium", classNames)}>
                        {label}
                        {icon}
                    </div>
                </LinkWithLocale>
            ) : (
                <div
                    className={clsx("flex flex-1 items-center justify-between font-medium", classNames)}
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
