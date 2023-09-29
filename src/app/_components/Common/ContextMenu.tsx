"use client";
import { MenuIcon } from "@/icons";
import clsx from "clsx";
import Link from "next/link";
import { FC, ReactNode, useState } from "react";
import ClickAwayListener from "react-click-away-listener";

export interface MenuItemProp {
    onClick?: () => void;
    link?: string;
    label: string;
    icon: ReactNode;
    classNames?: string;
}

interface Props {
    menuItems: MenuItemProp[];
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
                        className="dropdown-content menu rounded-box z-[1] mr-2 mt-6 w-52 rounded-tr-none bg-base-200 p-2 shadow-lg"
                        onClick={() => setMenuVisible(false)}
                    >
                        {menuItems?.map((item) => (
                            <MenuItem key={item.label} {...item} />
                        ))}
                    </ul>
                </div>
            </ClickAwayListener>
        </>
    );
};

const MenuItem: FC<MenuItemProp> = ({ link, label, icon, onClick, classNames }) => {
    return (
        <li>
            {link ? (
                <Link href={link} className="flex">
                    <div className={clsx("flex flex-1 items-center justify-between font-medium", classNames)}>
                        {label}
                        {icon}
                    </div>
                </Link>
            ) : (
                <div
                    onClick={(event) => {
                        event.preventDefault();
                        if (onClick) {
                            onClick();
                        }
                    }}
                    className={clsx("flex flex-1 items-center justify-between font-medium", classNames)}
                >
                    {label}
                    {icon}
                </div>
            )}
        </li>
    );
};
