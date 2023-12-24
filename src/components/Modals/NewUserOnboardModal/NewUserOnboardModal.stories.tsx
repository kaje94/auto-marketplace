import type { Meta, StoryObj } from "@storybook/react";

import { mockProfileData, mockUserClaims } from "@/utils/mockData";
import { NewUserOnboardModal } from "./NewUserOnboardModal";

const meta = {
    title: "Modals/NewUserOnboardModal",
    component: NewUserOnboardModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[80vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof NewUserOnboardModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { userData: mockProfileData, userClaims: mockUserClaims, initiallyVisible: true },
};
