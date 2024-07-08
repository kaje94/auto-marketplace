import type { Meta, StoryObj } from "@storybook/react";

import { mockNotificationItem, mockUserClaims, paginatedEmptyResp, paginatedResp } from "@/utils/mockData";
import { DashboardNotificationsList } from "./DashboardNotificationsList";

const meta = {
    title: "Dashboard/NotificationsList",
    component: DashboardNotificationsList,
    tags: ["autodocs"],
} satisfies Meta<typeof DashboardNotificationsList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dashboard notification items with data to be shown in my notifications page */
export const WithData: Story = {
    args: {
        notifications: [mockNotificationItem],
        basePath: "/base-path",
        pageLoading: false,
        userClaims: mockUserClaims,
        currentPageNumber: 1,
        paginatedResponse: paginatedResp,
    },
};

/** Initial placeholder to be shown while data is fetched */
export const LoadingWithoutData: Story = {
    args: {
        basePath: "/base-path",
        pageLoading: true,
    },
};

/** UI to be shown when there aren't any notification items after loading */
export const NoData: Story = {
    args: {
        notifications: [],
        basePath: "/base-path",
        pageLoading: false,
        userClaims: mockUserClaims,
        currentPageNumber: 1,
        paginatedResponse: paginatedEmptyResp,
    },
};
