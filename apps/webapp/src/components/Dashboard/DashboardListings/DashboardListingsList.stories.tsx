import type { Meta, StoryObj } from "@storybook/react";

import { mockListingItem, mockUserClaims, paginatedEmptyResp, paginatedResp } from "@/utils/mockData";
import { DashboardListingsList } from "./DashboardListingsList";

const meta = {
    title: "Dashboard/ListingsList",
    component: DashboardListingsList,
    tags: ["autodocs"],
} satisfies Meta<typeof DashboardListingsList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Dashboard listing items with data to be shown in my listings page and manage listings page */
export const WithData: Story = {
    args: {
        userClaims: mockUserClaims,
        isLoading: false,
        searchParamsObj: {},
        pageLoading: false,
        basePath: "/base-path",
        listings: [mockListingItem],
        currentPageNumber: 1,
        paginatedResponse: paginatedResp,
    },
};

/** UI to be show when route is transitioning due to page or filter change */
export const LoadingWithData: Story = {
    args: {
        userClaims: mockUserClaims,
        isLoading: true,
        searchParamsObj: {},
        pageLoading: false,
        basePath: "/base-path",
        listings: [mockListingItem],
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

/** UI to be shown when there aren't any listing items after loading */
export const NoData: Story = {
    args: {
        userClaims: mockUserClaims,
        isLoading: false,
        searchParamsObj: {},
        pageLoading: false,
        basePath: "/base-path",
        listings: [],
        currentPageNumber: 1,
        paginatedResponse: paginatedEmptyResp,
    },
};
