import Link from "next/link";
import { FC } from "react";

interface Props {
    currentPageTitle: string;
    links: { href?: string; title: string }[];
}

export const BreadCrumbs: FC<Props> = ({ links = [], currentPageTitle }) => {
    return (
        <div className="breadcrumbs text-sm">
            <ul>
                {links.map((link) => (
                    <li key={link.title}>{link.href ? <Link href={link.href}>{link.title}</Link> : link.title}</li>
                ))}
                <li className="font-medium text-base-content">{currentPageTitle}</li>
            </ul>
        </div>
    );
};
