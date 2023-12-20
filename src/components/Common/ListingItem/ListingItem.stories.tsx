import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem, mockUserLocation, mockVehicleImage1 } from "@/utils/mockData";
import { ListingItem } from "./ListingItem";

const meta = {
    title: "Common/ListingItem",
    component: ListingItem,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
    decorators: [(Story) => <div className="h-60 w-80">{Story()}</div>],
} satisfies Meta<typeof ListingItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { item: mockListingItem },
};

export const Tinted: Story = {
    args: { item: mockListingItem, tinted: true },
};

export const LoadingWithData: Story = {
    args: { item: mockListingItem, loading: true },
};

export const LoadingWithoutData: Story = {
    args: { loading: true },
};
