"use client";
import { clsx } from "clsx";
import { useParams, usePathname } from "next/navigation";
import { FC } from "react";
import { LinkWithLocale } from "@/components/Common";
import { AdvertIcon, ClipboardIcon, DatabaseIcon, ListIcon, NotificationIcon, RssIcon, SettingsIcon, UserIcon } from "@/icons";

interface Props {
    activePaths?: string[];
    badgeCount?: number;
    href: string;
    iconName?: "UserIcon" | "AdvertIcon" | "SettingsIcon" | "NotificationIcon" | "ListIcon" | "RssIcon" | "ClipboardIcon" | "DatabaseIcon";
    label: string;
    regexExp?: string;
}

export const NavBarItem: FC<Props> = ({ href, label, activePaths = [], regexExp, iconName, badgeCount }) => {
    const pathname = usePathname();
    const params = useParams();
    const badge = (
        <div className="badge badge-primary badge-md  border-2 border-accent bg-primary p-0.5 px-1 text-xs text-neutral">
            {badgeCount && badgeCount > 9 ? `9+` : badgeCount}
        </div>
    );

    return (
        <li>
            <LinkWithLocale
                className={clsx({
                    "px-4 py-3": true,
                    "active hover:!bg-base-content hover:!text-base-300":
                        activePaths.some((item) => `/${params.locale}${item}` === pathname) ||
                        (regexExp && new RegExp(`^/${params.locale}${regexExp}`)?.test(pathname)),
                })}
                href={href}
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
                                RssIcon: <RssIcon className="h-5 w-5" />,
                                ClipboardIcon: <ClipboardIcon className="h-5 w-5" />,
                                DatabaseIcon: <DatabaseIcon className="h-5 w-5" />,
                            }[iconName]
                        }
                    </>
                )}
                {label}
                {badgeCount ? badge : null}
            </LinkWithLocale>
        </li>
    );
};
