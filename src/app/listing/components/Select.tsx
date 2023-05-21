import clsx from "clsx";
import { ComponentProps, FC } from "react";

interface Props extends ComponentProps<"select"> {
  label?: string;
  selectClassName?: string;
  rootClassName?: string;
  error?: string;
  options?: { label: string; value: string }[];
  selectablePlaceholder?: boolean;
}

export const Select: FC<Props> = ({
  label,
  error,
  options = [],
  selectClassName,
  rootClassName,
  placeholder = "Pick One",
  selectablePlaceholder,
  ...rest
}) => {
  return (
    <div className={clsx("form-control w-full", rootClassName)}>
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <select
        className={clsx(
          "select select-bordered",
          error && "select-error",
          selectClassName
        )}
        {...rest}
      >
        <option disabled={!selectablePlaceholder} selected>
          {placeholder}
        </option>
        {options?.map((option) => (
          <option key={option.value}>{option.label}</option>
        ))}
      </select>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};
