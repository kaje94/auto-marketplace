import type { Meta, StoryObj } from "@storybook/react";

import { Pagination } from "./Pagination";

const meta = {
    title: "Common/Pagination",
    component: Pagination,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
    decorators: [(Story) => <div className="h-60 w-80">{Story()}</div>],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** ONce data has been loaded */
export const Default: Story = {
    args: { totalPages: 5, pageNumber: 2 },
};

/** While data is being loaded */
export const Loading: Story = {
    args: { totalPages: 5, pageNumber: 2, loading: true },
};
