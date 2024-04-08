"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { LinkWithLocale } from "@/components/Common";
import { InputController } from "@/components/FormElements/Input";
import { SelectController } from "@/components/FormElements/Select";
import { SearchIcon } from "@/icons";
import { VehicleTypeList } from "@/utils/constants";
import { PublicListingsFilterSchema } from "@/utils/schemas";
import { PublicListingsFilterReq } from "@/utils/types";

export const LandingHeroSearch = () => {
    const { control, watch } = useForm<PublicListingsFilterReq>({
        resolver: zodResolver(PublicListingsFilterSchema),
        mode: "onChange",
    });

    const formValues = watch();

    return (
        <span className="rounded-box flex w-full flex-col justify-center shadow-xl sm:w-fit sm:flex-row">
            <InputController
                control={control}
                fieldName="query"
                inputClassNames="bg-white rounded-box rounded-b-none sm:rounded-b-box sm:rounded-r-none"
                placeholder="Search..."
                errorAsTooltip
            />
            <div className="relative sm:w-36">
                <SelectController
                    control={control}
                    fieldName="vehicleType"
                    options={VehicleTypeList}
                    placeholder="All Types"
                    selectClassName="bg-white rounded-none !outline-none sm:!w-36"
                    errorAsTooltip
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
