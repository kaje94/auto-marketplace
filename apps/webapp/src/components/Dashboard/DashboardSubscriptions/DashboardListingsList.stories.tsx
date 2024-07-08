import type { Meta, StoryObj } from "@storybook/react";

import { mockSubscriptionItem, paginatedEmptyResp, paginatedResp } from "@/utils/mockData";
import { DashboardSubscriptionList } from "./DashboardSubscriptionList";

const meta = {
    title: "Dashboard/SubscriptionList",
    component: DashboardSubscriptionList,
    tags: ["autodocs"],
} satisfies Meta<typeof DashboardSubscriptionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dashboard subscription items with data to be shown in my subscriptions page and manage subscriptions page */
export const WithData: Story = {
    args: {
        isLoading: false,
        searchParamsObj: {},
        basePath: "/base-path",
        pageLoading: false,
        subscriptions: [mockSubscriptionItem],
        currentPageNumber: 1,
        paginatedResponse: paginatedResp,
    },
};

/** UI to be show when route is transitioning due to page or filter change */
export const LoadingWithData: Story = {
    args: {
        isLoading: true,
        searchParamsObj: {},
        basePath: "/base-path",
        pageLoading: false,
        subscriptions: [mockSubscriptionItem],
        currentPageNumber: 1,
        paginatedResponse: paginatedResp,
    },
};

/** Initial placeholder to be shown while data is fetched */
export const LoadingWithoutData: Story = {
    args: {
        searchParamsObj: {},
        isLoading: true,
        pageLoading: true,
    },
};

/** UI to be shown when there aren't any subscription items after loading */
export const NoData: Story = {
    args: {
        isLoading: false,
        searchParamsObj: {},
        basePath: "/base-path",
        pageLoading: false,
        subscriptions: [],
        currentPageNumber: 1,
        paginatedResponse: paginatedEmptyResp,
    },
};
