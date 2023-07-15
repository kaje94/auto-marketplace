import { SVGProps } from "react";

export const DropletIcon = (props: SVGProps<SVGSVGElement>) => (
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
        {...props}
    >
        <path d="m12 2.69 5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
);
