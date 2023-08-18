import { TagSelect } from "@/app/_components";
import { Vehicle } from "@/utils/types";
import { clsx } from "clsx";
import { FC } from "react";

interface Props {
    vehicle?: Vehicle;
    loading?: boolean;
}

export const FeaturesOfListing: FC<Props> = ({ vehicle, loading }) => {
    const placeholderWidth = ["w-44", "w-24", "w-32", "w-40", "w-48", "w-28", "w-16", "w-14"];

    return (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1">
            {loading ? (
                <>
                    {new Array(6).fill("").map((_, i) => (
                        <span
                            key={i}
                            className={clsx(
                                "badge animate-pulse bg-base-200 p-3",
                                placeholderWidth[Math.floor(Math.random() * placeholderWidth.length)]
                            )}
                        />
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
