import { clsx } from "clsx";
import { FC, PropsWithChildren } from "react";

interface Props {
    cancelable?: boolean;
    childrenClassnames?: string;
    modalClassnames?: string;
    onVisibleChange: (visible: boolean) => void;
    title?: string;
    titleClassNames?: string;
    visible?: boolean;
}

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
                        onVisibleChange(false);
                        event.preventDefault();
                    }}
                >
                    Close
                </label>
            </div>
        </>
    );
};
