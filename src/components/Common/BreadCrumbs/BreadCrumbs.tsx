import { FC } from "react";
import { LinkWithLocale } from "@/components/Common/LinkWithLocale";

interface Props {
    currentPageTitle: string;
    links: { href?: string; title: string }[];
}

export const BreadCrumbs: FC<Props> = ({ links = [], currentPageTitle }) => {
    return (
        <div className="breadcrumbs mb-2 text-sm sm:mb-0">
            <ul>
                {links.map((link) => (
                    <li key={link.title}>{link.href ? <LinkWithLocale href={link.href}>{link.title}</LinkWithLocale> : link.title}</li>
                ))}
                <li className="font-medium text-base-content">{currentPageTitle}</li>
            </ul>
        </div>
    );
};
