"use client";
import Link, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { FC } from "react";

/** Custom link component that will always redirect to the country specific route within the webapp */
export const LinkWithLocale: FC<
    React.AnchorHTMLAttributes<HTMLAnchorElement> &
        LinkProps & {
            children?: React.ReactNode;
        } & React.RefAttributes<HTMLAnchorElement>
> = ({ href, ...rest }) => {
    const params = useParams();
    return <Link {...rest} href={`${params.locale ? `/${params.locale}` : ""}${href}`} />;
};
