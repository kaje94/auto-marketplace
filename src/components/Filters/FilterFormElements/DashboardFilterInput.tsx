import { forwardRef } from "react";
import { ControllerProps, InputController } from "@/components/FormElements/Input";

export const FilterInput = forwardRef<HTMLInputElement, ControllerProps>((props, ref) => {
    return <InputController errorAsTooltip inputClassNames="input-sm" labelClassNames="pb-0 pt-0.5" {...props} ref={ref} />;
});
FilterInput.displayName = "Input";
