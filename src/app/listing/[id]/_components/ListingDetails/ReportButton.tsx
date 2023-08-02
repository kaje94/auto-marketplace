import { InfoIcon } from "@/icons";
import clsx from "clsx";
import { FC } from "react";

interface Props {
    loading?: boolean;
}

export const ReportButton: FC<Props> = ({ loading }) => (
    <button tabIndex={0} className={clsx("!btn-ghost btn-error btn-block btn gap-2", loading && "animate-pulse")} disabled={loading}>
        <InfoIcon />
        Report
    </button>
);
