"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { LinkWithLocale } from "@/components/Common";
import { SearchIcon } from "@/icons";
import { VehicleTypeList } from "@/utils/constants";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { PostedListingsFilterReq } from "@/utils/types";
import { AutocompleteController } from "../../FormElements/AutoComplete";
import { InputController } from "../../FormElements/Input";

export const LandingHeroSearch = () => {
    const { control, watch } = useForm<PostedListingsFilterReq>({
        resolver: zodResolver(PostedListingsFilterSchema),
        mode: "onChange",
    });

    const formValues = watch();

    return (
        <div className="mb-8 mt-5 flex w-full flex-col justify-center px-[5%] shadow-xl sm:mb-16 sm:w-auto sm:flex-row sm:px-0 xl:mb-28 2xl:mb-36">
            <InputController
                control={control}
                errorAsTooltip
                fieldName="Title"
                inputClassNames="bg-white rounded-box rounded-b-none sm:rounded-b-box sm:rounded-r-none"
                placeholder="Search..."
            />
            <div className="relative sm:w-36">
                <AutocompleteController
                    control={control}
                    errorAsTooltip
                    fieldName="VehicleType"
                    options={VehicleTypeList}
                    placeholder="Type"
                    selectClassNames="bg-white rounded-none !outline-none sm:!w-36"
                />
            </div>
            <LinkWithLocale
                className="btn btn-secondary join-item rounded-box rounded-t-none sm:rounded-t-box sm:rounded-l-none"
                href={qs.stringifyUrl({ url: "/search", query: formValues }, { skipEmptyString: true, skipNull: true })}
            >
                <SearchIcon />
                <span className="ml-2">Search</span>
            </LinkWithLocale>
        </div>
    );
};
