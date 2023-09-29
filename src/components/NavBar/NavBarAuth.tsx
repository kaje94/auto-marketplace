import { Session } from "next-auth";
import { Avatar } from "@/components/Common/Avatar";
import { AdvertIcon, NotificationIcon, RssIcon, UserIcon } from "@/icons";
import { NavBarLoginButton, NavBarLogoutButton, NavBarMenuLink } from "./NavBarButtons";

export const NavBarAuth = ({ session, notificationCount, loading }: { session?: Session | null; loading?: boolean; notificationCount?: number }) => {
    return (
        <div className="relative flex w-12 items-center justify-center">
            {loading ? (
                <span className="loading loading-ring w-8" />
            ) : (
                <>
                    {session ? (
                        <div className="dropdown-end dropdown">
                            <label className="btn-ghost btn-circle avatar btn" tabIndex={0}>
                                <div className="w-10 rounded-full ring ring-gray-600 ring-offset-base-100 duration-200 hover:ring-gray-400">
                                    <Avatar
                                        name={session?.user?.name!}
                                        url="https://lh3.googleusercontent.com/a/AAcHTtd7MmSI5uFKspCkopw4j4fnk64GQYhA2zL-EOKSdjTtNxk=s96-c-rg-br100"
                                        width={40}
                                    />
                                    {notificationCount ? (
                                        <div className=" badge badge-primary badge-md absolute -right-1 -top-1 z-10 flex aspect-square items-center justify-center border-2 border-accent bg-gradient-to-t from-secondary to-primary p-0.5 text-neutral shadow-2xl">
                                            <NotificationIcon className="animate-pulse" strokeWidth={3} />
                                        </div>
                                    ) : null}
                                </div>
                            </label>

                            <ul
                                className="dropdown-content menu rounded-box z-20 -mr-1 mt-3 w-60 rounded-tr-none bg-neutral p-2 text-neutral-content shadow-md shadow-black"
                                tabIndex={0}
                            >
                                <NavBarMenuLink icon={<UserIcon height={18} />} label="Profile" link="/dashboard/profile" />
                                <NavBarMenuLink
                                    badgeCount={notificationCount}
                                    icon={<NotificationIcon height={18} />}
                                    label="Notifications"
                                    link="/dashboard/notifications"
                                />
                                <NavBarMenuLink icon={<AdvertIcon height={18} />} label="My Adverts" link="/dashboard/my-listings" />
                                <NavBarMenuLink icon={<RssIcon height={18} />} label="My Subscriptions" link="/dashboard/my-subscriptions" />
                                <div className="divider mx-3 my-1 h-0.5 rounded bg-gray-800" />
                                <NavBarLogoutButton />
                            </ul>
                        </div>
                    ) : (
                        <NavBarLoginButton />
                    )}
                </>
            )}
        </div>
    );
};
