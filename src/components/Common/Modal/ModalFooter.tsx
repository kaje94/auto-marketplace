import { clsx } from "clsx";
import { FC } from "react";

interface Props {
    onVisibleChange: (visible: boolean) => void;
    primaryButton?: {
        text?: string;
        classNames?: string;
    };
    loading?: boolean;
    onSubmit?: () => void;
}

export const ModalFooter: FC<Props> = ({ onVisibleChange, primaryButton, loading, onSubmit }) => {
    return (
        <div className="mt-6 flex justify-end gap-3">
            <button className="btn-ghost btn" onClick={() => onVisibleChange(false)}>
                Cancel
            </button>
            <button onClick={onSubmit} className={clsx("btn-neutral btn", primaryButton?.classNames)}>
                {loading && <span className="loading loading-spinner"></span>}
                {primaryButton?.text}
            </button>
        </div>
    );
};
