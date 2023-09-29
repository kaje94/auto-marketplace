import { SVGProps } from "react";

export const AlertCircleIcon = (props: SVGProps<SVGSVGElement>) => (
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
        <path d="M12 8v4M12 16h.01" />
    </svg>
);
