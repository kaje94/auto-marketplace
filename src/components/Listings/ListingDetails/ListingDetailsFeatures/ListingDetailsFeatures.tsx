import { clsx } from "clsx";
import { FC } from "react";
import { getRandomItem } from "@/utils/helpers";
import { Vehicle } from "@/utils/types";

interface Props {
    loading?: boolean;
    vehicle?: Vehicle;
}

export const ListingDetailsFeatures: FC<Props> = ({ vehicle, loading }) => {
    const placeholderWidth = ["w-44", "w-24", "w-32", "w-40", "w-48", "w-28", "w-16", "w-14"];

    return (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
            {loading ? (
                <>
                    {new Array(6).fill("").map((_, i) => (
                        <span key={i} className={clsx("badge animate-pulse bg-base-200 p-3", getRandomItem(placeholderWidth))} />
                    ))}
                </>
            ) : (
                <>
                    {vehicle?.features?.map((item) => (
                        <span key={item.id} className="badge badge-neutral p-3">
                            {item.name}
                        </span>
                    ))}
                    {vehicle?.features?.length === 0 && <span className="mt-2 text-sm text-gray-500 opacity-70">No features available</span>}
                </>
            )}
        </div>
    );
};
