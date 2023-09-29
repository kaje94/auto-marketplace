"use client";
import { SearchIcon } from "@/icons";
import { PostedListingsFilterSchema } from "@/utils/schemas";
import { PostedListingsFilterReq } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { InputController } from "../../FormElements/Input";
import { VehicleTypeList } from "@/utils/constants";
import { AutocompleteController } from "../../FormElements/AutoComplete";
import qs from "query-string";

export const LandingHeroSearch = () => {
    const { control, watch } = useForm<PostedListingsFilterReq>({
        resolver: zodResolver(PostedListingsFilterSchema),
        mode: "onChange",
    });

    const formValues = watch();

    return (
        <div className="mb-8 mt-5 flex flex-col justify-center shadow-xl sm:mb-16 sm:flex-row xl:mb-28 2xl:mb-36">
            <InputController
                placeholder="Search..."
                fieldName="Title"
                control={control}
                errorAsTooltip
                inputClassNames="bg-white rounded-box rounded-b-none sm:rounded-b-box sm:rounded-r-none"
            />
            <div className="relative sm:w-36">
                <AutocompleteController
                    placeholder="Type"
                    fieldName="VehicleType"
                    control={control}
                    options={VehicleTypeList}
                    selectClassNames="bg-white rounded-none !outline-none sm:!w-36"
                    errorAsTooltip
                />
            </div>
            <Link
                href={qs.stringifyUrl({ url: "/search", query: formValues }, { skipEmptyString: true, skipNull: true })}
                className="btn-secondary rounded-box join-item btn rounded-t-none sm:rounded-t-box sm:rounded-l-none"
            >
                <SearchIcon />
                <span className="ml-2">Search</span>
            </Link>
        </div>
    );
};
