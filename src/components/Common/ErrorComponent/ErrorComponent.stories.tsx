import type { Meta, StoryObj } from "@storybook/react";

import { mockProfilePic } from "@/utils/mockData";
import { ErrorComponent } from "./ErrorComponent";

const meta = {
    title: "Common/ErrorComponent",
    component: ErrorComponent,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof ErrorComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Large: Story = {
    args: { variant: "lg" },
};

export const Small: Story = {
    args: { variant: "sm" },
};
