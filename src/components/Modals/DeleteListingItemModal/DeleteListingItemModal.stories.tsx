import type { Meta, StoryObj } from "@storybook/react";

import { DeleteListingItemModal } from "./DeleteListingItemModal";

const meta = {
    title: "Modals/DeleteListingItemModal",
    component: DeleteListingItemModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[50vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof DeleteListingItemModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { successRedirectPath: "", visible: true },
};
