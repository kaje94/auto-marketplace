import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

interface Props {
    visible: boolean;
    onVisibleChange: (visible: boolean) => void;
    title?: string;
    titleClassNames?: string;
}

export const Modal: FC<PropsWithChildren<Props>> = ({ visible, onVisibleChange, children, title, titleClassNames }) => {
    return (
        <>
            <div className={clsx({ modal: true, "modal-open": visible })}>
                <div
                    className="modal-box cursor-default"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                >
                    <button className="btn-ghost btn-sm btn-circle btn absolute right-2 top-2" onClick={() => onVisibleChange(false)}>
                        ✕
                    </button>
                    <div className={clsx("mb-2 text-lg font-bold", titleClassNames)}>{title}</div>
                    <div className="text-base-content opacity-75">{children}</div>
                </div>
                <label
                    className="modal-backdrop"
                    onClick={(event) => {
                        onVisibleChange(false);
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                >
                    Close
                </label>
            </div>
        </>
    );
};
