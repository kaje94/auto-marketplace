import clsx from "clsx";
import React from "react";

type PropType = {
    selected: boolean;
    imgSrc: string;
    index: number;
    onClick: () => void;
};

export const Thumb: React.FC<PropType> = (props) => {
    const { selected, imgSrc, index, onClick } = props;

    return (
        <div className={clsx("relative shrink-0 grow-0 pl-1 sm:pl-2 lg:pl-4 ", selected && "opacity-100")}>
            <button
                onClick={onClick}
                className={clsx(
                    "m-0 block w-full cursor-pointer touch-manipulation overflow-hidden rounded bg-transparent p-0 transition-opacity duration-200 lg:rounded-[--rounded-box]",
                    selected ? "opacity-100" : "opacity-20 hover:opacity-30"
                )}
                type="button"
            >
                <img className="block h-14 w-14 object-cover sm:h-20 sm:w-20 lg:h-24 lg:w-36" src={imgSrc} alt="Your alt text" />
            </button>
        </div>
    );
};
