import { forwardRef } from "react";
import { SelectController, ControllerProps } from "../FormElements/Select";

export const FilterSelect = forwardRef<HTMLSelectElement, ControllerProps>((props, ref) => {
    return <SelectController selectClassName="select-sm" labelClassNames="pb-0 pt-0.5" {...props} ref={ref} />;
});
FilterSelect.displayName = "Select";
