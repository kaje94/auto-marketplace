import type { Meta, StoryObj } from "@storybook/react";

import { LandingHeroSearch } from "./LandingHeroSearch";

const meta = {
    title: "Forms/LandingHeroSearch",
    component: LandingHeroSearch,
    tags: ["autodocs"],
    parameters: {
        nextjs: {
            appDirectory: true,
            navigation: { segments: [["locale", "LK"]] },
        },
        layout: "centered",
    },
} satisfies Meta<typeof LandingHeroSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};
