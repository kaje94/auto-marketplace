import type { Meta, StoryObj } from "@storybook/react";

import { mockSubscriptionItem } from "@/utils/mockData";
import { DeleteSubscriptionItemModal } from "./DeleteSubscriptionItemModal";

const meta = {
    title: "Modals/DeleteSubscriptionItemModal",
    component: DeleteSubscriptionItemModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[50vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof DeleteSubscriptionItemModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { subscriptionItem: mockSubscriptionItem, visible: true },
};
