import type { Meta, StoryObj } from "@storybook/react";

import { ErrorComponent } from "./ErrorComponent";

const meta = {
    title: "Common/ErrorComponent",
    component: ErrorComponent,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof ErrorComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Large variant of the error component to cover the majority of the screen */
export const Large: Story = {
    args: { variant: "lg" },
};

/** Small variant of the error component */
export const Small: Story = {
    args: { variant: "sm" },
};
