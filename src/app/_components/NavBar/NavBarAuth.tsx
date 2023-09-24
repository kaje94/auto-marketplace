import { UserIcon, AdvertIcon, RssIcon, NotificationIcon } from "@/icons";
import { NavBarMenuLink, NavBarLogoutButton, NavBarLoginButton } from "./NavBarButtons";
import { Session } from "next-auth";
import Image from "next/image";

export const NavBarAuth = ({ session, loading }: { session?: Session | null; loading?: boolean }) => {
    return (
        <div className="relative flex w-12 items-center justify-center">
            {loading ? (
                <span className="loading loading-ring w-8" />
            ) : (
                <>
                    {session ? (
                        <div className="dropdown-end dropdown">
                            <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                                <div className="w-10 rounded-full ring ring-gray-600 ring-offset-base-100 duration-200 hover:ring-gray-400">
                                    <Image
                                        src="https://lh3.googleusercontent.com/a/AAcHTtd7MmSI5uFKspCkopw4j4fnk64GQYhA2zL-EOKSdjTtNxk=s96-c-rg-br100"
                                        height={40}
                                        width={40}
                                        alt="profile-image"
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="badge badge-primary badge-md absolute -right-1 -top-1 flex aspect-square items-center justify-center border-2 border-accent bg-gradient-to-t from-secondary to-primary p-0.5 text-neutral shadow-2xl">
                                        <NotificationIcon strokeWidth={3} className="animate-pulse" />
                                    </div>
                                </div>
                            </label>

                            <ul
                                tabIndex={0}
                                className="dropdown-content menu rounded-box z-20 -mr-1 mt-3 w-60 rounded-tr-none bg-neutral p-2 text-neutral-content shadow-md shadow-black"
                            >
                                <NavBarMenuLink link="/dashboard/profile" label="Profile" icon={<UserIcon height={18} />} />
                                <NavBarMenuLink
                                    link="/dashboard/notifications"
                                    label="Notifications"
                                    icon={<NotificationIcon height={18} />}
                                    badgeCount={1}
                                />
                                <NavBarMenuLink link="/dashboard/my-listings" label="My Adverts" icon={<AdvertIcon height={18} />} />
                                <NavBarMenuLink link="/dashboard/my-subscriptions" label="My Subscriptions" icon={<RssIcon height={18} />} />
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
