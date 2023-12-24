import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem } from "@/utils/mockData";
import { ListingsCarousel } from "./ListingsCarousel";

const meta = {
    title: "Listings/ListingsCarousel",
    component: ListingsCarousel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="p-5">{Story()}</div>],
} satisfies Meta<typeof ListingsCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithOneItem: Story = {
    args: {
        items: [mockListingItem],
    },
};

export const WithMultiple: Story = {
    args: {
        items: [mockListingItem, mockListingItem, mockListingItem, mockListingItem, mockListingItem],
    },
};

export const Loading: Story = {
    args: {
        loading: true,
    },
};

export const Tinted: Story = {
    args: {
        items: [mockListingItem],
        tinted: true,
    },
};

export const WithViewMore: Story = {
    args: {
        items: [mockListingItem],
        viewMore: { link: "", subTitle: "View More SubTitle", title: "View More" },
    },
};
