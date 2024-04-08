import { SubscriptionItem } from "targabay-protos/gen/ts/dist/types/common_pb";
import type { Meta, StoryObj } from "@storybook/react";

import { mockSubscriptionItem } from "@/utils/mockData";
import { ToggleSubscriptionActivationModal } from "./ToggleSubscriptionActivationModal";

const meta = {
    title: "Modals/ToggleSubscriptionActivationModal",
    component: ToggleSubscriptionActivationModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[80vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof ToggleSubscriptionActivationModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Activate: Story = {
    args: { visible: true, subscriptionItem: { ...mockSubscriptionItem, active: false } as SubscriptionItem },
};

export const Deactivate: Story = {
    args: { visible: true, subscriptionItem: mockSubscriptionItem },
};
