import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem } from "@/utils/mockData";
import { ReviewListingModal } from "./ReviewListingModal";

const meta = {
    title: "Modals/ReviewListingModal",
    component: ReviewListingModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[80vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof ReviewListingModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { listingItem: mockListingItem, visible: true },
};
