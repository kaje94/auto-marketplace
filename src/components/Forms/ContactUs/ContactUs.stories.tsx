import type { Meta, StoryObj } from "@storybook/react";

import { ContactUsForm } from "./ContactUs";

const meta = {
    title: "Forms/ContactUs",
    component: ContactUsForm,
    tags: ["autodocs"],
} satisfies Meta<typeof ContactUsForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
