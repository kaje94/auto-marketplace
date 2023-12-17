import { forwardRef } from "react";
import { ControllerProps, SelectController } from "@/components/FormElements/Select";

export const FilterSelect = forwardRef<HTMLSelectElement, ControllerProps>((props, ref) => {
    return <SelectController errorAsTooltip labelClassNames="pb-0 pt-0.5" selectClassName="select-sm" selectablePlaceholder {...props} ref={ref} />;
});
FilterSelect.displayName = "Select";
