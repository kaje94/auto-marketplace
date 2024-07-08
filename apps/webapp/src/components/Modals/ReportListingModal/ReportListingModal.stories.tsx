import type { Meta, StoryObj } from "@storybook/react";

import { getListingTitleFromListing } from "@/utils/helpers";
import { mockListingItem, mockUserClaims } from "@/utils/mockData";
import { ReportListingModal } from "./ReportListingModal";

const meta = {
    title: "Modals/ReportListingModal",
    component: ReportListingModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
    decorators: [(Story) => <div className="h-[80vh] w-[50vw]">{Story()}</div>],
} satisfies Meta<typeof ReportListingModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { listingTitle: getListingTitleFromListing(mockListingItem?.data!), listingId: "", userEmail: mockUserClaims.email, visible: true },
};
