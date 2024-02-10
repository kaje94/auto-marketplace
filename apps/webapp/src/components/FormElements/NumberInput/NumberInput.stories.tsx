import type { Meta, StoryObj } from "@storybook/react";

import { NumberInput } from "./NumberInput";

const meta = {
    title: "FormElements/NumberInput",
    component: NumberInput,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const Disabled: Story = {
    args: {
        disabled: true,
    },
};
