import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox } from "./Checkbox";

const meta = {
    title: "FormElements/Checkbox",
    component: Checkbox,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { label: "Checkbox label" },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        label: "Checkbox label",
    },
};
