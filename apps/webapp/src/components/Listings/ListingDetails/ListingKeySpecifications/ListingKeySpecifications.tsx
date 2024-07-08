import { clsx } from "clsx";
import { FC } from "react";
import { ListingItem_Data } from "targabay-protos/gen/ts/dist/types/common_pb";
import { getDistanceUnit, getFormattedDistance, getRandomItem, numberWithCommas, unCamelCase } from "@/utils/helpers";

interface Props {
    countryCode?: string;
    loading?: boolean;
    vehicle?: ListingItem_Data;
}

export const ListingKeySpecifications: FC<Props> = ({ vehicle, loading, countryCode }) => {
    const placeholderWidth = ["w-28", "w-32", "w-28", "w-16", "w-24", "w-36", "w-14"];
    const millageUnit = getDistanceUnit(countryCode);

    const items: { label: string; value: string | number }[] = [];
    items.push({ label: "Brand", value: vehicle?.brand || "-" });
    items.push({ label: "Model", value: vehicle?.model || "-" });
    items.push({ label: "Trim / Edition", value: vehicle?.trim || "-" });
    items.push({ label: "Manufactured Year", value: vehicle?.yearOfManufacture ?? "-" });
    items.push({ label: "Registered Year", value: vehicle?.yearOfRegistration ? vehicle?.yearOfRegistration : "-" });
    items.push({ label: "Condition", value: vehicle?.condition ? unCamelCase(vehicle?.condition) : "-" });
    items.push({
        label: "Mileage",
        value: vehicle?.mileage ? getFormattedDistance(vehicle?.mileage, millageUnit) : "-",
    });
    items.push({ label: "Transmission", value: vehicle?.transmissionType ? unCamelCase(vehicle?.transmissionType) : "-" });
    items.push({ label: "Fuel Type", value: vehicle?.fuelType ? unCamelCase(vehicle?.fuelType) : "-" });
    items.push({ label: "Engine Capacity", value: vehicle?.engineCapacity ? `${numberWithCommas(vehicle?.engineCapacity)} CC` : "-" });

    return (
        <div className="mt-2 grid w-full gap-1 lg:grid-cols-2">
            {loading ? (
                <>
                    {new Array(10).fill("").map((_, i) => (
                        <div
                            key={i}
                            className={clsx(
                                "flex animate-pulse flex-col items-center gap-0.5 lg:md:gap-0.5",
                                i % 2 === 0 ? "lg:items-start" : "lg:items-end",
                            )}
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
