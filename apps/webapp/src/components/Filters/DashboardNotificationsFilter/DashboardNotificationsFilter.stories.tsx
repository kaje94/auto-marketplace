import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";

import { DashboardNotificationsFilterSchema } from "@/utils/schemas";
import { DashboardNotificationsFilterReq } from "@/utils/types";
import { DashboardNotificationsFilter } from "./DashboardNotificationsFilter";

const meta = {
    title: "Filters/DashboardNotificationsFilter",
    component: DashboardNotificationsFilter,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const form = useForm<DashboardNotificationsFilterReq>({ resolver: zodResolver(DashboardNotificationsFilterSchema), mode: "all" });
            return (
                <div className="relative m-10 flex h-[50vh] justify-end">
                    <Story args={{ ...ctx.args, form: form }} />
                </div>
            );
        },
    ],
} satisfies Meta<typeof DashboardNotificationsFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        dropdownOpen: true,
    },
};
