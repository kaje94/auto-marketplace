"use client";
import { FC } from "react";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdvertIcon, ListIcon, NotificationIcon, SettingsIcon, UserIcon } from "@/icons";

interface Props {
    href: string;
    label: string;
    activePaths?: string[];
    regexExp?: string;
    iconName?: "UserIcon" | "AdvertIcon" | "SettingsIcon" | "NotificationIcon" | "ListIcon";
}

export const NavBarItem: FC<Props> = ({ href, label, activePaths = [], regexExp, iconName }) => {
    const pathname = usePathname();
    return (
        <li>
            <Link
                href={href}
                className={clsx({
                    "px-4 py-3": true,
                    "active hover:!bg-base-content hover:!text-base-300":
                        activePaths.includes(pathname) || (regexExp && new RegExp(regexExp)?.test(pathname)),
                })}
            >
                {iconName && (
                    <>
                        {
                            {
                                UserIcon: <UserIcon className="h-5 w-5" />,
                                AdvertIcon: <AdvertIcon className="h-5 w-5" />,
                                SettingsIcon: <SettingsIcon className="h-5 w-5" />,
                                NotificationIcon: <NotificationIcon className="h-5 w-5" />,
                                ListIcon: <ListIcon className="h-5 w-5" />,
                            }[iconName]
                        }
                    </>
                )}
                {label}
            </Link>
        </li>
    );
};
