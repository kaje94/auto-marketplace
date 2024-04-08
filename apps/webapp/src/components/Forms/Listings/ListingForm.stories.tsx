import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Meta, StoryObj } from "@storybook/react";

import { mockUserLocation } from "@/utils/mockData";
import { CreateListingSchema } from "@/utils/schemas";
import { CreateListingReq } from "@/utils/types";
import { ListingForm } from "./ListingForm";

const meta = {
    title: "Forms/ListingForm",
    component: ListingForm,
    tags: ["autodocs"],
    decorators: [
        (Story, ctx) => {
            const form = useForm<CreateListingReq>({
                resolver: zodResolver(CreateListingSchema),
                defaultValues: {
                    vehicle: { vehicleImages: [], featureIds: [], millage: { unit: "km" }, trim: "" },
                    location: mockUserLocation,
                },
                mode: "all",
            });

            return <Story args={{ ...ctx.args, form: form }} />;
        },
    ],
} satisfies Meta<typeof ListingForm>;

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
