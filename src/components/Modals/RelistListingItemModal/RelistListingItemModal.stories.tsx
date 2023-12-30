import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem } from "@/utils/mockData";
import { RelistListingItemModal } from "./RelistListingItemModal";

const meta = {
    title: "Modals/RelistListingItemModal",
    component: RelistListingItemModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[50vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof RelistListingItemModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { listingItem: mockListingItem, visible: true },
};
