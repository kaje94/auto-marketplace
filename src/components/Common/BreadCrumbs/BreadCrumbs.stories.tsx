import type { Meta, StoryObj } from "@storybook/react";

import { BreadCrumbs } from "./BreadCrumbs";

const meta = {
    title: "Common/BreadCrumbs",
    component: BreadCrumbs,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof BreadCrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        currentPageTitle: "Page 1",
        links: [{ title: "dashboard" }, { title: "clickable-sub-page", href: "/" }],
    },
};
