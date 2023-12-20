import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";

import { MyListingsFilterSchema } from "@/utils/schemas";
import { MyListingsFilterReq } from "@/utils/types";
import { DashboardMyListFilter } from "./DashboardMyListFilter";

const meta = {
    title: "Filters/DashboardMyListFilter",
    component: DashboardMyListFilter,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const form = useForm<MyListingsFilterReq>({ resolver: zodResolver(MyListingsFilterSchema), mode: "all" });
            return (
                <div className="relative m-10 flex h-[50vh] justify-end">
                    <Story args={{ ...ctx.args, form: form }} />
                </div>
            );
        },
    ],
} satisfies Meta<typeof DashboardMyListFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        dropdownOpen: true,
    },
};
