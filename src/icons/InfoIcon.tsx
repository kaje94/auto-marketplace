import { SVGProps } from "react";

export const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
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
        <circle cx={12} cy={12} r={10} />
        <line x1={12} x2={12} y1={8} y2={12} />
        <line x1={12} x2={12.01} y1={16} y2={16} />
    </svg>
);
