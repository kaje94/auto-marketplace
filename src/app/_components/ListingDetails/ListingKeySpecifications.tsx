import { unCamelCase, getYearFromDateString, numberWithCommas, getRandomItem } from "@/utils/helpers";
import { Vehicle } from "@/utils/types";
import clsx from "clsx";
import { FC } from "react";

interface Props {
    vehicle?: Vehicle;
    loading?: boolean;
}

export const ListingKeySpecifications: FC<Props> = ({ vehicle, loading }) => {
    const placeholderWidth = ["w-44", "w-32", "w-28", "w-16", "w-24", "w-40", "w-40"];

    return (
        <div className="mt-2 grid w-full gap-2 lg:grid-cols-2">
            <div className="flex flex-col items-center gap-1 lg:items-start">
                {loading ? (
                    <>
                        {new Array(5).fill("").map((_, i) => (
                            <span key={i} className={clsx("my-0.5 h-5 animate-pulse bg-base-200", getRandomItem(placeholderWidth))} />
                        ))}
                    </>
                ) : (
                    <>
                        <div className="font-light">
                            Brand:<span className="ml-1 font-semibold text-primary-content">{vehicle?.brand}</span>
                        </div>
                        <div className="font-light">
                            Modal:<span className="ml-1 font-semibold text-primary-content">{vehicle?.model}</span>
                        </div>
                        <div className="font-light">
                            Trim / Edition::<span className="ml-1 font-semibold text-primary-content">{vehicle?.trim}</span>
                        </div>
                        <div className="font-light">
                            Condition::<span className="ml-1 font-semibold text-primary-content">{unCamelCase(vehicle?.condition ?? "")}</span>
                        </div>
                        <div className="font-light">
                            Manufactured Year:
                            <span className="ml-1 font-semibold text-primary-content">{getYearFromDateString(vehicle?.yearOfManufacture ?? "")}</span>
                        </div>
                    </>
                )}
            </div>
            <div className="flex flex-col items-center gap-1 text-right lg:items-end">
                {loading ? (
                    <>
                        {new Array(5).fill("").map((_, i) => (
                            <span key={i} className={clsx("my-0.5 h-5 animate-pulse bg-base-200", getRandomItem(placeholderWidth))} />
                        ))}
                    </>
                ) : (
                    <>
                        <div className="font-light">
                            Milage:<span className="ml-1 font-semibold text-primary-content">{numberWithCommas(vehicle?.millage ?? 0)}</span>
                        </div>
                        <div className="font-light">
                            Transmission:<span className="ml-1 font-semibold text-primary-content">{unCamelCase(vehicle?.transmission ?? "")}</span>
                        </div>
                        <div className="font-light">
                            Fuel Type:<span className="ml-1 font-semibold text-primary-content">{vehicle?.fuelType}</span>
                        </div>
                        <div className="font-light">
                            Engine Capacity:
                            <span className="ml-1 font-semibold text-primary-content">{numberWithCommas(vehicle?.engineCapacity ?? 0)}</span>
                        </div>
                        <div className="font-light">
                            Registered Year:
                            <span className="ml-1 font-semibold text-primary-content">
                                {getYearFromDateString(vehicle?.yearOfRegistration ?? "")}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
