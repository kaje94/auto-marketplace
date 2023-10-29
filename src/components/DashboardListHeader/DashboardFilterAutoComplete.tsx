import { forwardRef } from "react";
import { AutocompleteController, ControllerProps } from "@/components/FormElements/AutoComplete";

export const FilterAutoComplete = forwardRef<HTMLSelectElement, ControllerProps>((props, ref) => {
    return <AutocompleteController errorAsTooltip labelClassNames="pb-0 pt-0.5" selectClassNames="select-sm" {...props} />;
});
FilterAutoComplete.displayName = "AutoComplete";
