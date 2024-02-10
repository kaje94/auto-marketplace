import type { Meta, StoryObj } from "@storybook/react";

import { mockVehicleBrands } from "@/utils/mockData";
import { PostedListingsSearchFilters } from "./PostedListingsSearchFilters";

const meta = {
    title: "Listings/PostedListingsSearchFilters",
    component: PostedListingsSearchFilters,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
    decorators: [(Story) => <div className="p-5">{Story()}</div>],
} satisfies Meta<typeof PostedListingsSearchFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        vehicleBrands: mockVehicleBrands,
    },
};
