import { forwardRef } from "react";
import { ControllerProps, InputController } from "@/components/FormElements/Input";

export const FilterInput = forwardRef<HTMLInputElement, ControllerProps>((props, ref) => {
    return <InputController inputClassNames="input-sm" labelClassNames="pb-0 pt-0.5" errorAsTooltip {...props} ref={ref} />;
});
FilterInput.displayName = "Input";
