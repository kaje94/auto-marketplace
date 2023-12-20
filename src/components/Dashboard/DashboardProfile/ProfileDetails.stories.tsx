import type { Meta, StoryObj } from "@storybook/react";

import { mockProfileData } from "@/utils/mockData";
import { ProfileDetails } from "./ProfileDetails";

const meta = {
    title: "Dashboard/ProfileDetails",
    component: ProfileDetails,
    tags: ["autodocs"],
} satisfies Meta<typeof ProfileDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Once profile details are loaded */
export const Loaded: Story = {
    args: {
        profile: mockProfileData,
    },
};

/** Skeleton UI while profile details are loading */
export const Loading: Story = {
    args: {
        loading: true,
    },
};
