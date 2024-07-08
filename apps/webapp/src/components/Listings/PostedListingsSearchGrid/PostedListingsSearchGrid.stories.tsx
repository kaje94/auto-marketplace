import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem } from "@/utils/mockData";
import { PostedListingsSearchGrid } from "./PostedListingsSearchGrid";

const meta = {
    title: "Listings/PostedListingsSearchGrid",
    component: PostedListingsSearchGrid,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="p-5">{Story()}</div>],
} satisfies Meta<typeof PostedListingsSearchGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        listings: [mockListingItem],
    },
};

export const Loading: Story = {
    args: {
        pageLoading: true,
    },
};
