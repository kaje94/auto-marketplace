import { ReactNode } from "react";

export default function Loading({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="divider mt-16">Related Adverts</div>
            {children}
        </>
    );
}
