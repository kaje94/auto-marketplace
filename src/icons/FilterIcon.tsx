import { SVGProps } from "react";

export const FilterIcon = (props: SVGProps<SVGSVGElement>) => (
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
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
);
