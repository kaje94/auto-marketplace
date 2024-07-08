import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";

import { PublicListingsFilterSchema } from "@/utils/schemas";
import { PublicListingsFilterReq } from "@/utils/types";
import { PostedListSearchFilters } from "./PostedListSearchFilters";

const meta = {
    title: "Filters/PostedListSearchFilters",
    component: PostedListSearchFilters,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const form = useForm<PublicListingsFilterReq>({ resolver: zodResolver(PublicListingsFilterSchema), mode: "onChange" });
            return (
                <div className="relative m-10 flex h-[50vh] justify-end">
                    <Story args={{ ...ctx.args, form: form }} />
                </div>
            );
        },
    ],
} satisfies Meta<typeof PostedListSearchFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        dropdownOpen: true,
        defaultFilter: {},
    },
};
