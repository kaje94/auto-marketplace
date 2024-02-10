import { SVGProps } from "react";

export const AdvertIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        fill="none"
        height={24}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        width={24}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <circle cx={12} cy={8} r={7} />
        <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12" />
    </svg>
);
