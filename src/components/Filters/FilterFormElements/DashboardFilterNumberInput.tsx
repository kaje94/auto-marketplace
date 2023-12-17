import { forwardRef } from "react";
import { ControllerProps, NumberInputController } from "@/components/FormElements/NumberInput";

export const FilterNumberInput = forwardRef<HTMLInputElement, ControllerProps>((props, ref) => {
    return <NumberInputController inputClassNames="input-sm" labelClassNames="pb-0 pt-0.5" errorAsTooltip {...props} ref={ref} />;
});
FilterNumberInput.displayName = "NumberInput";
