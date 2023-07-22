import clsx from "clsx";
import { FC } from "react";

type Props = {
    tags: { id: string | number; name: string }[];
    selectedTags: (string | number)[];
};

export const TagSelect: FC<Props> = ({ tags, selectedTags }) => {
    return (
        <div className="flex flex-wrap gap-1">
            {tags.map((tag) => {
                const tagSelected = selectedTags.includes(tag.id);
                return (
                    <span
                        key={tag.id}
                        className={clsx({
                            "badge cursor-pointer p-3 duration-200": true,
                            "badge-neutral opacity-100 hover:opacity-75": tagSelected,
                            "badge-outline hover:bg-base-300": !tagSelected,
                        })}
                    >
                        {tag.name}
                    </span>
                );
            })}
        </div>
    );
};
