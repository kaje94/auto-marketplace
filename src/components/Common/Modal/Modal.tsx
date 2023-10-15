import { clsx } from "clsx";
import { FC, PropsWithChildren } from "react";

interface Props {
    cancelable?: boolean;
    modalClassnames?: string;
    onVisibleChange: (visible: boolean) => void;
    title?: string;
    titleClassNames?: string;
    visible: boolean;
}

export const Modal: FC<PropsWithChildren<Props>> = ({
    visible,
    onVisibleChange,
    modalClassnames,
    children,
    title,
    titleClassNames,
    cancelable = true,
}) => {
    return (
        <>
            <div className={clsx({ modal: true, "modal-open": visible })}>
                <div className={clsx("modal-box cursor-default", modalClassnames)} onClick={(event) => event.preventDefault()}>
                    {cancelable && (
                        <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2" onClick={() => onVisibleChange(false)}>
                            ✕
                        </button>
                    )}
                    <div className={clsx("mb-2 text-lg font-bold", titleClassNames)}>{title}</div>
                    <div className="text-base-content opacity-90">{children}</div>
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
