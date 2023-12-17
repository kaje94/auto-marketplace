"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { LinkWithLocale } from "@/components/Common";
import { AutocompleteController } from "@/components/FormElements/AutoComplete";
import { InputController } from "@/components/FormElements/Input";
import { SelectController } from "@/components/FormElements/Select";
import { SearchIcon } from "@/icons";
import { VehicleTypeList } from "@/utils/constants";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { PostedListingsFilterReq } from "@/utils/types";

export const LandingHeroSearch = () => {
    const { control, watch } = useForm<PostedListingsFilterReq>({
        resolver: zodResolver(PostedListingsFilterSchema),
        mode: "onChange",
    });

    const formValues = watch();

    return (
        <span className="rounded-box flex w-full flex-col justify-center shadow-xl sm:w-fit sm:flex-row">
            <InputController
                control={control}
                errorAsTooltip
                fieldName="Title"
                inputClassNames="bg-white rounded-box rounded-b-none sm:rounded-b-box sm:rounded-r-none"
                placeholder="Search..."
            />
            <div className="relative sm:w-36">
                <SelectController
                    control={control}
                    errorAsTooltip
                    fieldName="VehicleType"
                    options={VehicleTypeList}
                    placeholder="All Types"
                    selectClassName="bg-white rounded-none !outline-none sm:!w-36"
                    selectablePlaceholder
                />
            </div>
            <LinkWithLocale
                className="btn btn-secondary join-item rounded-box rounded-t-none sm:rounded-t-box sm:rounded-l-none"
                href={qs.stringifyUrl({ url: "/search", query: formValues }, { skipEmptyString: true, skipNull: true })}
            >
                <SearchIcon />
                <span className="ml-2">Search</span>
            </LinkWithLocale>
        </span>
    );
};
