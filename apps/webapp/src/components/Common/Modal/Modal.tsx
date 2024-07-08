import { clsx } from "clsx";
import { FC, PropsWithChildren } from "react";

export interface Props {
    /** Determines if the modal can be canceled or not. */
    cancelable?: boolean;
    /** Additional classnames for the children of the modal. */
    childrenClassnames?: string;
    /** Additional classnames for the modal. */
    modalClassnames?: string;
    /**
     * Callback function called when the visibility of the modal changes.
     * @param visible - Indicates if the modal is visible or not.
     */
    onVisibleChange: (visible: boolean) => void;
    /** The title of the modal. */
    title?: string;
    /** Additional classnames for the title of the modal. */
    titleClassNames?: string;
    /** Determines if the modal is visible or not. */
    visible?: boolean;
}

/** Modal component to be used for all modals throughout the webapp */
export const Modal: FC<PropsWithChildren<Props>> = ({
    visible,
    onVisibleChange,
    modalClassnames,
    children,
    title,
    titleClassNames,
    childrenClassnames,
    cancelable = true,
}) => {
    return (
        <>
            <div className={clsx({ modal: true, "modal-open": visible })}>
                <div className={clsx("modal-box cursor-default p-0", modalClassnames)} onClick={(event) => event.preventDefault()}>
                    {cancelable && (
                        <button
                            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2 text-base-content"
                            onClick={() => onVisibleChange(false)}
                        >
                            ✕
                        </button>
                    )}
                    <div className={clsx("mb-2 px-4 pt-4 text-lg font-bold text-neutral lg:px-6 lg:pt-6", titleClassNames)}>{title}</div>
                    <div className={clsx("p-4 pt-2 text-base-content opacity-90 lg:p-6 lg:pt-2", childrenClassnames)}>{children}</div>
                </div>
                <label
                    className="modal-backdrop backdrop-blur-sm backdrop-brightness-75"
                    onClick={(event) => {
                        if (cancelable) {
                            onVisibleChange(false);
                        }
                        event.preventDefault();
                    }}
                >
                    Close
                </label>
            </div>
        </>
    );
};
