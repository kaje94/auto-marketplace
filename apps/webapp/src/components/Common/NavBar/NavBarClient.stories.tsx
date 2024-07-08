import type { Meta, StoryObj } from "@storybook/react";

import { mockProfileData, mockUserClaims } from "@/utils/mockData";
import { NavBarClient } from "./NavBarClient";

const meta = {
    title: "Common/NavBar",
    component: NavBarClient,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
} satisfies Meta<typeof NavBarClient>;

export default meta;
type Story = StoryObj<typeof meta>;

/** When user is not logged in */
export const Default: Story = {
    args: {},
};

/** When user details are loaded */
export const Loading: Story = {
    args: { loading: true },
};

/** When user is logged in */
export const LoggedIn: Story = {
    args: {
        userClaims: mockUserClaims,
        userData: mockProfileData,
    },
};

/** When logged in user also has notifications */
export const WithNotifications: Story = {
    args: {
        userClaims: mockUserClaims,
        userData: mockProfileData,
        notificationCount: 2,
    },
};
