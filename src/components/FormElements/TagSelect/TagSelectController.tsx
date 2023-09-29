import { clsx } from "clsx";
import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import { getRandomItem } from "@/utils/helpers";
import { TagSelect } from "./TagSelect";

interface Props {
    loading?: boolean;
    tags?: { id: number; name: string }[];
    loadingPlaceholderCount?: number;
    fieldName: string;
    control?: Control<any>;
}

export const TagSelectController: FC<Props> = ({ tags = [], fieldName, loading, loadingPlaceholderCount = 10, control }) => {
    const placeholderWidth = ["w-44", "w-24", "w-32", "w-40", "w-48", "w-28", "w-16", "w-14", "w-10"];

    if (loading || !control) {
        return (
            <div className="flex flex-wrap gap-1">
                {new Array(loadingPlaceholderCount).fill("").map((_, i) => (
                    <span key={i} className={clsx("badge animate-pulse bg-base-200 p-3", getRandomItem(placeholderWidth))} />
                ))}
            </div>
        );
    }
    return (
        <Controller
            control={control}
            name={fieldName}
            render={({ field: { value = [], onChange } }) => <TagSelect onSelect={onChange} selectedTags={value} tags={tags} />}
        />
    );
};
