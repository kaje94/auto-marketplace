import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem, mockListingsResponse, mockVehicleBrands } from "@/utils/mockData";
import { PostedListingsSearchGrid } from "./PostedListingsSearchGrid";

const meta = {
    title: "Listings/PostedListingsSearchGrid",
    component: PostedListingsSearchGrid,
    tags: ["autodocs"],
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: { segments: [["locale", "LK"]] },
        },
        layout: "fullscreen",
    },
    decorators: [(Story) => <div className="p-5">{Story()}</div>],
} satisfies Meta<typeof PostedListingsSearchGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        listings: mockListingsResponse,
    },
};

export const Loading: Story = {
    args: {
        pageLoading: true,
    },
};
