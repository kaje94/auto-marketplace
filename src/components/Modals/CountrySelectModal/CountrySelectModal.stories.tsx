import type { Meta, StoryObj } from "@storybook/react";

import { CountrySelectModal } from "./CountrySelectModal";

const meta = {
    title: "Modals/CountrySelectModal",
    component: CountrySelectModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[50vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof CountrySelectModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { currentLocale: "LK", visible: true },
};
