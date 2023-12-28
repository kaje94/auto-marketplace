import type { Meta, StoryObj } from "@storybook/react";

import { mockLabelValue } from "@/utils/mockData";
import { Select } from "./Select";

const meta = {
    title: "FormElements/Select",
    component: Select,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { options: mockLabelValue },
};

export const Disabled: Story = {
    args: { disabled: true },
};
