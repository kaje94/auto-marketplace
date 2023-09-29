import { SVGProps } from "react";

export const DropletIcon = (props: SVGProps<SVGSVGElement>) => (
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
        <path d="m12 2.69 5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
);
