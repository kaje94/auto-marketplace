import type { Meta, StoryObj } from "@storybook/react";

import { Logo } from "./Logo";

const meta = {
    title: "Common/Logo",
    component: Logo,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const Large: Story = {
    args: { fontsize: "text-2xl" },
};

export const ExtraLarge: Story = {
    args: { fontsize: "text-3xl" },
};
