import { ListingItem as ListingItemType } from "@/utils/types";
import { FC } from "react";
import { ListingsCarousel } from "./ListingsCarousel";

interface Props {
    title?: string;
    items?: ListingItemType[];
    loading?: boolean;
}

// todo: handle loading UI
export const ListingsCarouselSection: FC<Props> = ({ items = [], title }) => {
    return (
        <>
            {items.length > 0 && (
                <>
                    {title && <div className="divider mt-16">{title}</div>}
                    <ListingsCarousel items={items} />
                </>
            )}
        </>
    );
};
