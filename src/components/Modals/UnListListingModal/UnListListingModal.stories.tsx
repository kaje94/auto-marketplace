import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem } from "@/utils/mockData";
import { UnListListingModal } from "./UnListListingModal";

const meta = {
    title: "Modals/UnListListingModal",
    component: UnListListingModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[80vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof UnListListingModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { visible: true, listingItem: mockListingItem },
};
