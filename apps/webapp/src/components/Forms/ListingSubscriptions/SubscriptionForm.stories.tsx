import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";

import { CreateSubscriptionSchema } from "@/utils/schemas";
import { CreateSubscriptionReq } from "@/utils/types";
import { SubscriptionForm } from "./SubscriptionForm";

const meta = {
    title: "Forms/SubscriptionForm",
    component: SubscriptionForm,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const form = useForm<CreateSubscriptionReq>({
                resolver: zodResolver(CreateSubscriptionSchema),
                defaultValues: {
                    maxPrice: { currencyCode: "LKR", currencySymbol: "Rs." },
                    minPrice: { currencyCode: "LKR", currencySymbol: "Rs." },
                    minMillage: { unit: "km" },
                    maxMillage: { unit: "km" },
                },
                mode: "all",
            });

            return <Story args={{ ...ctx.args, form: form }} />;
        },
    ],
} satisfies Meta<typeof SubscriptionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Form UI once loaded */
export const Default: Story = {
    args: {},
};

/** Skeleton UI when loading the form */
export const Loading: Story = {
    args: { isLoading: true },
};
