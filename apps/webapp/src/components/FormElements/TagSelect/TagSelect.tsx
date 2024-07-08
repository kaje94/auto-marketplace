import { clsx } from "clsx";
import { FC } from "react";

interface Props {
    disabled?: boolean;
    onSelect?: (item: string[]) => void;
    selectedTags?: string[];
    tags?: string[];
}

export const TagSelect: FC<Props> = ({ tags = [], selectedTags = [], onSelect = () => {}, disabled }) => {
    return (
        <div className="flex flex-wrap gap-1">
            {tags.map((tag) => {
                const tagSelected = selectedTags.includes(tag);
                return (
                    <span
                        key={tag}
                        className={clsx({
                            "badge cursor-pointer p-3 duration-200 select-none": true,
                            "badge-neutral opacity-100 hover:opacity-75": tagSelected,
                            "badge-outline hover:bg-base-300": !tagSelected,
                            "!opacity-50 btn-disabled !cursor-not-allowed": disabled,
                        })}
                        onClick={() => {
                            if (!disabled) {
                                if (selectedTags?.includes(tag)) {
                                    onSelect(selectedTags?.filter((id) => tag !== id));
                                } else {
                                    onSelect([...selectedTags, tag]);
                                }
                            }
                        }}
                    >
                        {tag}
                    </span>
                );
            })}
        </div>
    );
};
