import type { Meta, StoryObj } from "@storybook/react";

import { mockProfileData, mockUserClaims } from "@/utils/mockData";
import { NavBarClient } from "./NavBarClient";

const meta = {
    title: "Common/NavBar",
    component: NavBarClient,
    tags: ["autodocs"],
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: { segments: [["locale", "LK"]] },
        },
        layout: "fullscreen",
    },
} satisfies Meta<typeof NavBarClient>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const Loading: Story = {
    args: { loading: true },
};

export const LoggedIn: Story = {
    args: {
        userClaims: mockUserClaims,
        userData: mockProfileData,
    },
};

export const WithNotifications: Story = {
    args: {
        userClaims: mockUserClaims,
        userData: mockProfileData,
        notificationCount: 2,
    },
};
