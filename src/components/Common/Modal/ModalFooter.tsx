import { clsx } from "clsx";
import { FC } from "react";

interface Props {
    /** Whether the modal is in a loading state */
    loading?: boolean;
    /** Callback function when the form is submitted */
    onSubmit?: () => void;
    /** Callback function when the visibility of the modal changes */
    onVisibleChange?: (visible: boolean) => void;
    /** Configuration for the primary button */
    primaryButton?: {
        /** Additional class names for the primary button */
        classNames?: string;
        /** Id used for e2e tests */
        testId?: string;
        /** Text to be displayed on the primary button */
        text?: string;
    };
    /** Whether to show the cancel button */
    showCancel?: boolean;
}

/** Footer of the modal with a cancel button and a primary button */
export const ModalFooter: FC<Props> = ({ onVisibleChange, primaryButton, loading, onSubmit, showCancel = true }) => {
    return (
        <div className="mt-6 flex justify-end gap-3">
            {showCancel && (
                <button
                    className="btn btn-ghost"
                    onClick={() => {
                        if (onVisibleChange) {
                            onVisibleChange(false);
                        }
                    }}
                >
                    Cancel
                </button>
            )}
            <button
                className={clsx("btn", primaryButton?.classNames || "!btn-neutral")}
                data-testid={primaryButton?.testId}
                disabled={loading}
                onClick={onSubmit}
            >
                {loading && <span className="loading loading-spinner"></span>}
                {primaryButton?.text}
            </button>
        </div>
    );
};
