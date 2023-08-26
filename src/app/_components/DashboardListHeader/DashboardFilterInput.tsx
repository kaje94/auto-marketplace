import { forwardRef } from "react";
import { Input as InputComponent, Props as InputProps } from "@/app/_components/Input";

export const FilterInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return <InputComponent inputClassNames="input-sm" labelClassNames="pb-0 pt-0.5" {...props} ref={ref} />;
});
FilterInput.displayName = "Input";
