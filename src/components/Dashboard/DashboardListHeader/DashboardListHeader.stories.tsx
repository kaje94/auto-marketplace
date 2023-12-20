import type { Meta, StoryObj } from "@storybook/react";

import { DashboardListHeader } from "./DashboardListHeader";
import { FilterButton } from "./FilterButton";

const meta = {
    title: "Dashboard/ListHeader",
    component: DashboardListHeader,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            return (
                <Story
                    args={{
                        ...ctx.args,
                        filter: <FilterButton dropdownOpen={false} handleFilterOpen={() => {}} hasSearchParams={false} loading={false} />,
                    }}
                />
            );
        },
    ],
} satisfies Meta<typeof DashboardListHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** List header in loaded state */
export const Loaded: Story = {
    args: {},
};

/** Skelton placeholder while data is loaded */
export const Loading: Story = {
    args: {
        loading: true,
    },
};

/** Header with add new item button */
export const WithAddButton: Story = {
    args: {
        addNewButton: { label: "Add new Item", path: "/" },
        itemCount: 5,
    },
};
