import { forwardRef } from "react";
import { AutocompleteController, ControllerProps } from "@/components/FormElements/AutoComplete";

export const FilterAutoComplete = forwardRef<HTMLSelectElement, ControllerProps>((props) => {
    return <AutocompleteController labelClassNames="pb-0 pt-0.5" selectClassNames="select-sm" errorAsTooltip {...props} />;
});
FilterAutoComplete.displayName = "AutoComplete";
