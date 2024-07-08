import type { Meta, StoryObj } from "@storybook/react";

import { Empty } from "./Empty";

const meta = {
    title: "Common/Empty",
    component: Empty,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        text: "Main title",
        button: { text: "button text", href: "/" },
        iconSize: "lg",
        subText: "Sub text",
    },
};
