import type { Meta, StoryObj } from "@storybook/react";

import { TextArea } from "./TextArea";

const meta = {
    title: "FormElements/TextArea",
    component: TextArea,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof TextArea>;

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
