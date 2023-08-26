import { forwardRef } from "react";
import { Select as SelectComponent, Props as SelectProps } from "@/app/_components/Select";

export const FilterSelect = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
    return <SelectComponent selectClassName="select-sm" labelClassName="pb-0 pt-0.5" {...props} ref={ref} />;
});
FilterSelect.displayName = "Select";
