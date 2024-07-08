import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";
import { UserNotificationsFilterSchema } from "@/utils/schemas";
import { UserNotificationsFilterReq } from "@/utils/types";
import { DashboardNotificationsFilter } from "./DashboardNotificationsFilter";

const meta = {
    title: "Filters/DashboardNotificationsFilter",
    component: DashboardNotificationsFilter,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const form = useForm<UserNotificationsFilterReq>({ resolver: zodResolver(UserNotificationsFilterSchema), mode: "all" });
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
