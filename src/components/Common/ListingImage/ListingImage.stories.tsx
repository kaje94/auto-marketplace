import type { Meta, StoryObj } from "@storybook/react";

import { mockUserLocation, mockVehicleImage1 } from "@/utils/mockData";
import { ListingImage } from "./ListingImage";

const meta = {
    title: "Common/ListingImage",
    component: ListingImage,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
    },
} satisfies Meta<typeof ListingImage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        location: mockUserLocation,
        title: "listing-title",
        width: 450,
        height: 300,
        image: mockVehicleImage1,
    },
};

export const ImageNotFound: Story = {
    args: {
        location: mockUserLocation,
        title: "listing-title",
        width: 450,
        height: 300,
        image: { ...mockVehicleImage1, name: " " },
    },
};
