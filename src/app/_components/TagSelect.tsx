import clsx from "clsx";
import { FC } from "react";

type Props = {
    tags?: { id: number; name: string }[];
    selectedTags?: number[];
    onSelect?: (item: number[]) => void;
    loading?: boolean;
    loadingPlaceholderCount?: number;
};

export const TagSelect: FC<Props> = ({ tags = [], selectedTags = [], loading, loadingPlaceholderCount = 10, onSelect = () => {} }) => {
    const placeholderWidth = ["w-44", "w-24", "w-32", "w-40", "w-48", "w-28", "w-16", "w-14", "w-10"];
    return (
        <div className="flex flex-wrap gap-1">
            {loading ? (
                <>
                    {new Array(loadingPlaceholderCount).fill("").map((_, i) => (
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
                    {tags.map((tag) => {
                        const tagSelected = selectedTags.includes(tag.id);
                        return (
                            <span
                                key={tag.id}
                                className={clsx({
                                    "badge cursor-pointer p-3 duration-200 select-none": true,
                                    "badge-neutral opacity-100 hover:opacity-75": tagSelected,
                                    "badge-outline hover:bg-base-300": !tagSelected,
                                })}
                                onClick={() => {
                                    if (selectedTags?.includes(tag.id)) {
                                        onSelect(selectedTags?.filter((id) => tag.id !== id));
                                    } else {
                                        onSelect([...selectedTags, tag.id]);
                                    }
                                }}
                            >
                                {tag.name}
                            </span>
                        );
                    })}
                </>
            )}
        </div>
    );
};
