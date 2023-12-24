import { FC } from "react";
import { LinkWithLocale } from "@/components/Common/LinkWithLocale";

interface Props {
    /** Title of the page that the user is in */
    currentPageTitle: string;
    /** Links shown in the breadcrumb */
    links: {
        /** Page that the link should open. Link will be disabled if this is not provided */
        href?: string;
        /** Title of an individual link */
        title: string;
    }[];
}

/** Reusable breadcrumb component used throughout the app */
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
