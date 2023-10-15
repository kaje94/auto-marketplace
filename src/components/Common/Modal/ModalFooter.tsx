import { clsx } from "clsx";
import { FC } from "react";

interface Props {
    loading?: boolean;
    onSubmit?: () => void;
    onVisibleChange: (visible: boolean) => void;
    primaryButton?: {
        classNames?: string;
        text?: string;
    };
    showCancel?: boolean;
}

export const ModalFooter: FC<Props> = ({ onVisibleChange, primaryButton, loading, onSubmit, showCancel = true }) => {
    return (
        <div className="mt-6 flex justify-end gap-3">
            {showCancel && (
                <button className="btn btn-ghost" onClick={() => onVisibleChange(false)}>
                    Cancel
                </button>
            )}
            <button className={clsx("btn", primaryButton?.classNames || "!btn-neutral")} disabled={loading} onClick={onSubmit}>
                {loading && <span className="loading loading-spinner"></span>}
                {primaryButton?.text}
            </button>
        </div>
    );
};
