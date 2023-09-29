import { SVGProps } from "react";

export const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
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
        <rect height={13} rx={2} ry={2} width={13} x={9} y={9} />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);
