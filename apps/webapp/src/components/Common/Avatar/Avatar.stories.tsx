import type { Meta, StoryObj } from "@storybook/react";

import { mockProfilePic } from "@/utils/mockData";
import { Avatar } from "./Avatar";

const meta = {
    title: "Common/Avatar",
    component: Avatar,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** If the image is loaded successfully, use it instead of placeholders */
export const Loaded: Story = {
    args: {
        name: "User",
        url: mockProfilePic,
        width: 200,
    },
};

/** If user name is available, use the first character as the placeholder */
export const LoadingWithName: Story = {
    args: {
        name: "User",
        url: " ",
        width: 150,
        loading: true,
    },
};

/** If the name field is not available, use an icon as the placeholder */
export const LoadingWithoutName: Story = {
    args: {
        url: " ",
        loading: true,
        width: 100,
    },
};
