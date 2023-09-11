import clsx from "clsx";
import { FC } from "react";

interface Props {
    tags?: { id: number; name: string }[];
    selectedTags?: number[];
    onSelect?: (item: number[]) => void;
}

export const TagSelect: FC<Props> = ({ tags = [], selectedTags = [], onSelect = () => {} }) => {
    return (
        <div className="flex flex-wrap gap-1">
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
        </div>
    );
};
