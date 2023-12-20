import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";

import { DashboardListingFilterSchema } from "@/utils/schemas";
import { DashboardListFilterReq } from "@/utils/types";
import { DashboardAllListFilter } from "./DashboardAllListFilter";

const meta = {
    title: "Filters/DashboardAllListFilter",
    component: DashboardAllListFilter,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const form = useForm<DashboardListFilterReq>({ resolver: zodResolver(DashboardListingFilterSchema), mode: "all" });

            return (
                <div className="relative m-10 flex h-[50vh] justify-end">
                    <Story args={{ ...ctx.args, form: form }} />
                </div>
            );
        },
    ],
} satisfies Meta<typeof DashboardAllListFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        dropdownOpen: true,
    },
};
