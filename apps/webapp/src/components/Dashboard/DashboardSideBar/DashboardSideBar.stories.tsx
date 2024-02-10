import type { Meta, StoryObj } from "@storybook/react";

import { mockUserClaims } from "@/utils/mockData";
import { DashboardSideBarItems } from "./DashboardSideBar";

const meta = {
    title: "Dashboard/DashboardSideBar",
    component: DashboardSideBarItems,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof DashboardSideBarItems>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        userClaims: mockUserClaims,
        notificationCount: 2,
    },
};
