import type { Meta, StoryObj } from "@storybook/react";

import { CloseAccountModal } from "./CloseAccountModal";

const meta = {
    title: "Modals/CloseAccountModal",
    component: CloseAccountModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[50vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof CloseAccountModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { userId: "", visible: true },
};
