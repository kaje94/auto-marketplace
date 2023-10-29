import { forwardRef } from "react";
import { ControllerProps, NumberInput } from "@/components/FormElements/NumberInput";

export const FilterNumberInput = forwardRef<HTMLInputElement, ControllerProps>((props, ref) => {
    return <NumberInput errorAsTooltip inputClassNames="input-sm" labelClassNames="pb-0 pt-0.5" {...props} ref={ref} />;
});
FilterNumberInput.displayName = "NumberInput";
