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
    <div
      className={clsx(
        "relative lg:pl-4 sm:pl-2 pl-1 grow-0 shrink-0 ",
        selected && "opacity-100"
      )}
    >
      <button
        onClick={onClick}
        className={clsx(
          "duration-200 transition-opacity w-full m-0 p-0 pointer block touch-manipulation bg-transparent rounded lg:rounded-[--rounded-box] overflow-hidden",
          selected ? "opacity-100" : "opacity-20 hover:opacity-30"
        )}
        type="button"
      >
        <img
          className="sm:h-20 lg:h-24 h-14 sm:w-20 lg:w-36 w-14 block object-cover"
          src={imgSrc}
          alt="Your alt text"
        />
      </button>
    </div>
  );
};
