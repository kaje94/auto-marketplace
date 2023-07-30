import clsx from "clsx";
import { FC, PropsWithChildren } from "react";

interface Props {
    visible: boolean;
    onVisibleChange: (visible: boolean) => void;
}
export const Modal: FC<PropsWithChildren<Props>> = ({ visible, onVisibleChange, children }) => {
    return (
        <>
            <input type="checkbox" className="modal-toggle" checked={visible} onChange={(event) => onVisibleChange(event.target.checked)} />
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
                    {children}
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
