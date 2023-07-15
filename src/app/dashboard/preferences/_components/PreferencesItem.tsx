import { FC } from "react";
import { TrashIcon, EditIcon } from "@/icons";

interface Props {}

const preferences = [
    {
        label: "Keyword",
        value: "Toyota",
    },
    {
        label: "Brand",
        value: "Toyota",
    },
    {
        label: "Year",
        value: "2022",
    },
    {
        label: "Features",
        value: "AC, Airbags",
    },
];

export const PreferencesItem: FC<Props> = () => (
    <div className="card relative mb-2 grid grid-cols-1 items-center gap-4 bg-base-100 p-2 shadow-md md:grid-cols-5 md:p-5">
        <div className="col-span-1 grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 md:col-span-4 xl:grid-cols-4">
            {preferences.map((item) => (
                <div key={item.label}>
                    <span className="opacity-50">{item.label}:</span>
                    <span className="ml-2 text-accent">{item.value}</span>
                </div>
            ))}
        </div>
        <div className="col-span-1 flex flex-col items-center justify-center gap-4 md:col-span-1 md:flex-row">
            <div className="w-full md:tooltip md:w-min" data-tip="Delete Preference">
                <button className="btn-outline btn-error btn-square btn w-full md:w-12">
                    <TrashIcon />
                    <span className="ml-2 md:hidden">Delete</span>
                </button>
            </div>
            <div className="w-full md:tooltip  md:w-min" data-tip="Edit Preference">
                <button className="btn-outline btn-square btn w-full md:w-12">
                    <EditIcon />
                    <span className="ml-2 md:hidden">Edit</span>
                </button>
            </div>
        </div>
    </div>
);
