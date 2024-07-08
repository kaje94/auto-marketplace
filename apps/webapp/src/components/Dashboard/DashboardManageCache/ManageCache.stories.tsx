import type { Meta, StoryObj } from "@storybook/react";

import { ManageCache } from "./ManageCache";

const meta = {
    title: "Dashboard/ManageCache",
    component: ManageCache,
    tags: ["autodocs"],
} satisfies Meta<typeof ManageCache>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
