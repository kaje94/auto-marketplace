import { SVGProps } from "react";

export const FilterIcon = (props: SVGProps<SVGSVGElement>) => (
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
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
);
