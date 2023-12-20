import type { Meta, StoryObj } from "@storybook/react";

import { mockProfileData } from "@/utils/mockData";
import { ProfileUpdateModal } from "./ProfileUpdateModal";

const meta = {
    title: "Modals/ProfileUpdateModal",
    component: ProfileUpdateModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[80vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof ProfileUpdateModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { userData: mockProfileData, visible: true },
};
