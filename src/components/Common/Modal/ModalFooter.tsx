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
}

export const ModalFooter: FC<Props> = ({ onVisibleChange, primaryButton, loading, onSubmit }) => {
    return (
        <div className="mt-6 flex justify-end gap-3">
            <button className="btn-ghost btn" onClick={() => onVisibleChange(false)}>
                Cancel
            </button>
            <button className={clsx("btn-neutral btn", primaryButton?.classNames)} onClick={onSubmit}>
                {loading && <span className="loading loading-spinner"></span>}
                {primaryButton?.text}
            </button>
        </div>
    );
};
