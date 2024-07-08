import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem } from "@/utils/mockData";
import { ListingDetails } from "./ListingDetails";

const meta = {
    title: "Listings/ListingDetails",
    component: ListingDetails,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="p-5">{Story()}</div>],
} satisfies Meta<typeof ListingDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {
    args: {
        itemDetails: mockListingItem,
    },
};

export const Loading: Story = {
    args: {
        loading: true,
    },
};
