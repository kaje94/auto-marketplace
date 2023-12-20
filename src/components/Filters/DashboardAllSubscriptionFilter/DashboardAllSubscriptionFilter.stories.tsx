import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";

import { DashboardSubscriptionFilterSchema } from "@/utils/schemas";
import { DashboardSubscriptionFilterReq } from "@/utils/types";
import { DashboardAllSubscriptionFilter } from "./DashboardAllSubscriptionFilter";

const meta = {
    title: "Filters/DashboardAllSubscriptionFilter",
    component: DashboardAllSubscriptionFilter,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const form = useForm<DashboardSubscriptionFilterReq>({ resolver: zodResolver(DashboardSubscriptionFilterSchema), mode: "all" });

            return (
                <div className="relative m-10 flex h-[50vh] justify-end">
                    <Story args={{ ...ctx.args, form: form }} />
                </div>
            );
        },
    ],
} satisfies Meta<typeof DashboardAllSubscriptionFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        dropdownOpen: true,
    },
};
