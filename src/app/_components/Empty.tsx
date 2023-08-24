import { InboxIcon } from "@/icons";
import { FC } from "react";

interface Props {
    text?: string;
    buttonText?: string;
}

export const Empty: FC<Props> = ({ text = "You do not have any items yet. Get started by adding your first item" }) => (
    <div className="flex h-full flex-col items-center justify-center px-10 py-20 opacity-50">
        <InboxIcon className="h-52 w-52 text-base-300" strokeWidth={0.5} />
        <p className="mt-2 max-w-sm text-center text-base">{text}</p>
    </div>
);
