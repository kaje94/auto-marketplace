import { BreadCrumbs } from "@/app/_components";
import { EditIcon, TrashIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";

const DetailsItem = ({ title, value }: { title: string; value: string }) => (
    <div>
        <div className="text-xs opacity-50">{title}</div>
        <div>{value}</div>
    </div>
);

const ProfilePage = () => {
    return (
        <>
            <BreadCrumbs links={[{ href: "/", title: "Home" }, { title: "Dashboard" }]} currentPageTitle="Profile" />

            <div className="stat card flex flex-col items-center gap-4 bg-base-100 p-4 shadow ">
                <div className="rounded-box flex w-full flex-col items-center gap-2 bg-gradient-to-t from-base-300 to-base-200 p-2 md:p-3 lg:gap-4 xl:p-6">
                    <div className="mt-1 flex w-16 rounded-full ring ring-offset-base-100 md:w-24 xl:w-32 ">
                        <Image
                            src="https://lh3.googleusercontent.com/a/AAcHTtd7MmSI5uFKspCkopw4j4fnk64GQYhA2zL-EOKSdjTtNxk=s96-c-rg-br100"
                            height={128}
                            width={128}
                            alt="profile-image"
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-1 text-center">
                        <div className="text-xl font-bold text-neutral md:text-2xl xl:text-4xl">Kajendran Alagaratnam</div>
                        <div className="text-sm  opacity-70">User</div>
                    </div>
                </div>

                <div className="grid w-full gap-4 lg:grid-cols-2 xl:gap-7 2xl:gap-8">
                    <div className="flex flex-col gap-1">
                        <div className="text-lg font-bold">Contact Details</div>
                        <div className="flex flex-col gap-2">
                            <DetailsItem title="Email" value="a.kajendran@gmail.com" />
                            <DetailsItem title="Phone Number" value="+9422332423" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-lg font-bold">Location Details</div>
                        <div className="flex flex-col gap-2">
                            <DetailsItem title="City" value="Colombo" />
                            <DetailsItem title="State" value="Western Province" />
                            <DetailsItem title="Country" value="Sri Lanka" />
                            <DetailsItem title="Postal Code" value="023242" />
                        </div>
                    </div>
                </div>

                <div className="mt-3 flex w-full flex-wrap justify-end gap-2">
                    <button className="btn-error btn-outline btn">
                        <TrashIcon />
                        Delete Profile
                    </button>
                    <Link href="/dashboard/profile/edit">
                        <button className="btn-neutral btn">
                            <EditIcon />
                            Update Profile
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
