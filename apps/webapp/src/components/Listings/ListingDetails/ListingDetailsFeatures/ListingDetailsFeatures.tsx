import { clsx } from "clsx";
import { FC } from "react";
import { getRandomItem } from "@/utils/helpers";

interface Props {
    features?: string[];
    loading?: boolean;
}

export const ListingDetailsFeatures: FC<Props> = ({ features, loading }) => {
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
                    {features?.map((item) => (
                        <span key={item} className="badge badge-neutral p-3">
                            {item}
                        </span>
                    ))}
                    {features?.length === 0 && <span className="mt-2 text-sm text-gray-500 opacity-70">No features available</span>}
                </>
            )}
        </div>
    );
};
