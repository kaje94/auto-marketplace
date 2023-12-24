import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem } from "@/utils/mockData";
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

/** Component to be shown once the data has been loaded */
export const Default: Story = {
    args: { item: mockListingItem },
};

/** Tinted listing item to be used in the landing page listing carousel */
export const Tinted: Story = {
    args: { item: mockListingItem, tinted: true },
};

/** Component to be shown while user is performing a filter or page change action */
export const LoadingWithData: Story = {
    args: { item: mockListingItem, loading: true },
};

/** Component to be shown while the initial API call is made */
export const LoadingWithoutData: Story = {
    args: { loading: true },
};
