import { SVGProps } from "react";

export const ZapIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        className="feather feather-zap"
        {...props}
    >
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);
