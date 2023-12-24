import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem } from "@/utils/mockData";
import { RenewListingItemModal } from "./RenewListingItemModal";

const meta = {
    title: "Modals/RenewListingItemModal",
    component: RenewListingItemModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[50vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof RenewListingItemModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { listingItem: mockListingItem, visible: true },
};
