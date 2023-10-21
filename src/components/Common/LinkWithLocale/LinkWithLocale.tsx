"use client";
import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { FC } from "react";

export const LinkWithLocale: FC<
    React.AnchorHTMLAttributes<HTMLAnchorElement> &
        LinkProps & {
            children?: React.ReactNode;
        } & React.RefAttributes<HTMLAnchorElement>
> = ({ href, ...rest }) => {
    const params = useParams();
    return <Link {...rest} href={`/${params.locale}${href}`} />;
};
