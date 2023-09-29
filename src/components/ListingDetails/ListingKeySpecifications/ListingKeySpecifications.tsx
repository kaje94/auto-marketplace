import { clsx } from "clsx";
import { FC } from "react";
import { getRandomItem, getYearFromDateString, numberWithCommas, unCamelCase } from "@/utils/helpers";
import { Vehicle } from "@/utils/types";

interface Props {
    vehicle?: Vehicle;
    loading?: boolean;
}

export const ListingKeySpecifications: FC<Props> = ({ vehicle, loading }) => {
    const placeholderWidth = ["w-28", "w-32", "w-28", "w-16", "w-24", "w-36", "w-14"];

    const items: { label: string; value: string | number }[] = [];
    if (vehicle?.brand) {
        items.push({ label: "Brand", value: vehicle.brand });
    }
    if (vehicle?.model) {
        items.push({ label: "Modal", value: vehicle.model });
    }
    if (vehicle?.trim) {
        items.push({ label: "Trim / Edition", value: vehicle.trim });
    }
    if (vehicle?.yearOfManufacture) {
        items.push({ label: "Manufactured Year", value: getYearFromDateString(vehicle.yearOfManufacture) });
    }
    if (vehicle?.yearOfRegistration) {
        items.push({ label: "Registered Year", value: getYearFromDateString(vehicle.yearOfRegistration) });
    }
    if (vehicle?.condition) {
        items.push({ label: "Condition", value: unCamelCase(vehicle?.condition) });
    }
    if (vehicle?.millage) {
        items.push({ label: "Milage", value: `${numberWithCommas(vehicle?.millage)} km` });
    }
    if (vehicle?.transmission) {
        items.push({ label: "Transmission", value: unCamelCase(vehicle?.transmission) });
    }
    if (vehicle?.fuelType) {
        items.push({ label: "Fuel Type", value: unCamelCase(vehicle?.fuelType) });
    }
    if (vehicle?.engineCapacity) {
        items.push({ label: "Engine Capacity", value: `${numberWithCommas(vehicle?.engineCapacity)}CC` });
    }
    return (
        <div className="mt-2 grid w-full gap-1 lg:grid-cols-2">
            {loading ? (
                <>
                    {new Array(10).fill("").map((_, i) => (
                        <div
                            key={i}
                            className={clsx("flex flex-col items-center gap-0.5 lg:md:gap-0.5", i % 2 === 0 ? "lg:items-start" : "lg:items-end")}
                        >
                            <div className={clsx("h-4 w-11 bg-base-200", getRandomItem(placeholderWidth))} />
                            <div className={clsx("h-5 bg-base-200", getRandomItem(placeholderWidth))} />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    {items.map((item, index) => (
                        <div
                            key={item.label}
                            className={clsx("flex flex-col items-center md:gap-0.5", index % 2 === 0 ? "lg:items-start" : "lg:items-end")}
                        >
                            <div className="text-sm font-light">{item.label}</div>
                            <div className="!break-words text-base font-semibold text-primary-content">{item.value}</div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};
