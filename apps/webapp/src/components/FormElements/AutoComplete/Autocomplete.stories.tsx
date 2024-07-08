import type { Meta, StoryObj } from "@storybook/react";

import { mockLabelValue } from "@/utils/mockData";
import { Autocomplete } from "./Autocomplete";

const meta = {
    title: "FormElements/Autocomplete",
    component: Autocomplete,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        options: mockLabelValue,
        fieldName: "field-name",
    },
};

export const Disabled: Story = {
    args: {
        options: mockLabelValue,
        fieldName: "field-name",
        disabled: true,
    },
};
