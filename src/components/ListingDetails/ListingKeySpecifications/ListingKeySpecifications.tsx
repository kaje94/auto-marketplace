"use client";
import { clsx } from "clsx";
import { FC } from "react";
import { useScopedI18n } from "@/locales/client";
import { getFormattedDistance, getRandomItem, getYearFromDateString, numberWithCommas, unCamelCase } from "@/utils/helpers";
import { Vehicle } from "@/utils/types";

interface Props {
    loading?: boolean;
    vehicle?: Vehicle;
}

export const ListingKeySpecifications: FC<Props> = ({ vehicle, loading }) => {
    const placeholderWidth = ["w-28", "w-32", "w-28", "w-16", "w-24", "w-36", "w-14"];

    const tForm = useScopedI18n("form");

    const items: { label: string; value: string | number }[] = [];
    items.push({ label: tForm("brand.label"), value: vehicle?.brand || "-" });
    items.push({ label: tForm("model.label"), value: vehicle?.model || "-" });
    items.push({ label: tForm("trim.label"), value: vehicle?.trim || "-" });
    items.push({ label: tForm("yom.label"), value: vehicle?.yearOfManufacture ? getYearFromDateString(vehicle.yearOfManufacture) : "-" });
    items.push({
        label: tForm("yearOfRegistration.label"),
        value: vehicle?.yearOfRegistration ? getYearFromDateString(vehicle.yearOfRegistration) : "-",
    });
    items.push({ label: tForm("condition.label"), value: vehicle?.condition ? unCamelCase(vehicle?.condition) : "-" });
    items.push({
        label: tForm("mileage.label"),
        value: vehicle?.millage?.distance ? getFormattedDistance(vehicle?.millage?.distance, vehicle?.millage?.unit) : "-",
    });
    items.push({ label: tForm("transmissionType.label"), value: vehicle?.transmission ? unCamelCase(vehicle?.transmission) : "-" });
    items.push({ label: tForm("fuelType.label"), value: vehicle?.fuelType ? unCamelCase(vehicle?.fuelType) : "-" });
    items.push({ label: tForm("engineCapacity.label"), value: vehicle?.engineCapacity ? `${numberWithCommas(vehicle?.engineCapacity)} CC` : "-" });

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
