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
        tags: [
            { id: "1", name: "Item 1" },
            { id: "2", name: "Item 2" },
            { id: "3", name: "Item 3" },
        ],
    },
};

export const Disabled: Story = {
    args: {
        tags: [
            { id: "1", name: "Item 1" },
            { id: "2", name: "Item 2" },
            { id: "3", name: "Item 3" },
        ],
        disabled: true,
    },
};
