import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";
import { UserSubscriptionsFilterSchema } from "@/utils/schemas";
import { UserSubscriptionsFilterReq } from "@/utils/types";
import { DashboardMySubscriptionFilter } from "./DashboardMySubscriptionFilter";

const meta = {
    title: "Filters/DashboardMySubscriptionFilter",
    component: DashboardMySubscriptionFilter,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const form = useForm<UserSubscriptionsFilterReq>({ resolver: zodResolver(UserSubscriptionsFilterSchema), mode: "all" });
            return (
                <div className="relative m-10 flex h-[50vh] justify-end">
                    <Story args={{ ...ctx.args, form: form }} />
                </div>
            );
        },
    ],
} satisfies Meta<typeof DashboardMySubscriptionFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        dropdownOpen: true,
    },
};
