import type { Meta, StoryObj } from "@storybook/react";

import { TagSelect } from "./TagSelect";

const meta = {
    title: "FormElements/TagSelect",
    component: TagSelect,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof TagSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        tags: ["Item 1", "Item 2", "Item 3"],
    },
};

export const Disabled: Story = {
    args: {
        tags: ["Item 1", "Item 2", "Item 3"],
        disabled: true,
    },
};
