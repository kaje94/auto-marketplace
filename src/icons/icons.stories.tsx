import type { Meta, StoryObj } from "@storybook/react";

import * as Icons from "./index";

const meta = {
    title: "Icons",
    component: Icons.ActivityIcon,
    tags: ["autodocs"],
    parameters: { layout: "centered" },
} satisfies Meta<typeof Icons.ActivityIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActivityIcon: Story = { render: (args) => <Icons.ActivityIcon {...args} /> };
export const AdvertIcon: Story = { render: (args) => <Icons.AdvertIcon {...args} /> };
export const AlertCircleIcon: Story = { render: (args) => <Icons.AlertCircleIcon {...args} /> };
export const BellIcon: Story = { render: (args) => <Icons.BellIcon {...args} /> };
export const BellOffIcon: Story = { render: (args) => <Icons.BellOffIcon {...args} /> };
export const CheckCircleIcon: Story = { render: (args) => <Icons.CheckCircleIcon {...args} /> };
export const CheckIcon: Story = { render: (args) => <Icons.CheckIcon {...args} /> };
export const ChevronLeftIcon: Story = { render: (args) => <Icons.ChevronLeftIcon {...args} /> };
export const ChevronRightIcon: Story = { render: (args) => <Icons.ChevronRightIcon {...args} /> };
export const ClipboardIcon: Story = { render: (args) => <Icons.ClipboardIcon {...args} /> };
export const CloseIcon: Story = { render: (args) => <Icons.CloseIcon {...args} /> };
export const CopyIcon: Story = { render: (args) => <Icons.CopyIcon {...args} /> };
export const DatabaseIcon: Story = { render: (args) => <Icons.DatabaseIcon {...args} /> };
export const DollarIcon: Story = { render: (args) => <Icons.DollarIcon {...args} /> };
export const DropletIcon: Story = { render: (args) => <Icons.DropletIcon {...args} /> };
export const EditIcon: Story = { render: (args) => <Icons.EditIcon {...args} /> };
export const EyeIcon: Story = { render: (args) => <Icons.EyeIcon {...args} /> };
export const EyeOffIcon: Story = { render: (args) => <Icons.EyeOffIcon {...args} /> };
export const FacebookIcon: Story = { render: (args) => <Icons.FacebookIcon {...args} /> };
export const FeatherIcon: Story = { render: (args) => <Icons.FeatherIcon {...args} /> };
export const FilterIcon: Story = { render: (args) => <Icons.FilterIcon {...args} /> };
export const HomeIcon: Story = { render: (args) => <Icons.HomeIcon {...args} /> };
export const InfoIcon: Story = { render: (args) => <Icons.InfoIcon {...args} /> };
export const LayersIcon: Story = { render: (args) => <Icons.LayersIcon {...args} /> };
export const ListIcon: Story = { render: (args) => <Icons.ListIcon {...args} /> };
export const LoginIcon: Story = { render: (args) => <Icons.LoginIcon {...args} /> };
export const LogoutIcon: Story = { render: (args) => <Icons.LogoutIcon {...args} /> };
export const MaximizeIcon: Story = { render: (args) => <Icons.MaximizeIcon {...args} /> };
export const MenuIcon: Story = { render: (args) => <Icons.MenuIcon {...args} /> };
export const NotificationIcon: Story = { render: (args) => <Icons.NotificationIcon {...args} /> };
export const PlusIcon: Story = { render: (args) => <Icons.PlusIcon {...args} /> };
export const RefreshIcon: Story = { render: (args) => <Icons.RefreshIcon {...args} /> };
export const RssIcon: Story = { render: (args) => <Icons.RssIcon {...args} /> };
export const SearchIcon: Story = { render: (args) => <Icons.SearchIcon {...args} /> };
export const SettingsIcon: Story = { render: (args) => <Icons.SettingsIcon {...args} /> };
export const ShareIcon: Story = { render: (args) => <Icons.ShareIcon {...args} /> };
export const TagIcon: Story = { render: (args) => <Icons.TagIcon {...args} /> };
export const TrashIcon: Story = { render: (args) => <Icons.TrashIcon {...args} /> };
export const TwitterIcon: Story = { render: (args) => <Icons.TwitterIcon {...args} /> };
export const UserIcon: Story = { render: (args) => <Icons.UserIcon {...args} /> };
export const XCircleIcon: Story = { render: (args) => <Icons.XCircleIcon {...args} /> };
export const XIcon: Story = { render: (args) => <Icons.XIcon {...args} /> };
export const ZapIcon: Story = { render: (args) => <Icons.ZapIcon {...args} /> };
export const StarIcon: Story = { render: (args) => <Icons.StarIcon {...args} /> };
