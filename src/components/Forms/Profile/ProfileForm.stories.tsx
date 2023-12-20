import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";

import { mockUserLocation } from "@/utils/mockData";
import { UpdateProfileSchema } from "@/utils/schemas";
import { UpdateProfileReq } from "@/utils/types";
import { ProfileForm } from "./ProfileForm";

const meta = {
    title: "Forms/ProfileForm",
    component: ProfileForm,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const form = useForm<UpdateProfileReq>({
                resolver: zodResolver(UpdateProfileSchema),
                defaultValues: { address: mockUserLocation, isDealership: true, phoneNumber: "123456789" },
                mode: "all",
            });

            return <Story args={{ ...ctx.args, form: form }} />;
        },
    ],
} satisfies Meta<typeof ProfileForm>;

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
