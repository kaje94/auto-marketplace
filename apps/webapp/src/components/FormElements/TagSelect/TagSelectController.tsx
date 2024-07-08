import { clsx } from "clsx";
import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import { getRandomItem } from "@/utils/helpers";
import { TagSelect } from "./TagSelect";

interface Props {
    control?: Control<any>;
    disabled?: boolean;
    fieldName: string;
    loading?: boolean;
    loadingPlaceholderCount?: number;
    tags?: string[];
}

export const TagSelectController: FC<Props> = ({ tags = [], fieldName, loading, loadingPlaceholderCount = 10, control, disabled }) => {
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
            render={({ field: { value = [], onChange } }) => <TagSelect disabled={disabled} selectedTags={value} tags={tags} onSelect={onChange} />}
        />
    );
};
