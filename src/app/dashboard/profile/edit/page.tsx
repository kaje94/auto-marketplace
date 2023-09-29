import { BreadCrumbs } from "@/components/Common";
import { Avatar } from "@/components/Common/Avatar";

export default async function Page() {
    return (
        <>
            <BreadCrumbs
                links={[{ href: "/", title: "Home" }, { title: "Dashboard" }, { title: "Profile", href: "/dashboard/profile" }]}
                currentPageTitle="Edit Profile"
            />
            <div className="stat card flex flex-col gap-2 bg-base-100 p-4 shadow ">
                <div className="rounded-box flex w-full flex-col items-center gap-2 bg-gradient-to-t from-base-300 to-base-200 p-2 md:p-3 lg:gap-4 xl:p-6">
                    <div className="mt-1 flex w-16 rounded-full ring ring-offset-base-100 md:w-24 xl:w-32 ">
                        <Avatar
                            url="https://lh3.googleusercontent.com/a/AAcHTtd7MmSI5uFKspCkopw4j4fnk64GQYhA2zL-EOKSdjTtNxk=s96-c-rg-br100"
                            width={128}
                        />
                    </div>
                </div>
                <div className="grid w-full gap-1 lg:grid-cols-2">
                    {/* <Input label="Name" disabled placeholder="User name" />
                    <Input label="Email" disabled placeholder="user@gmail.com" />
                    <Input label="Phone Number" required placeholder="+94 774436111" /> */}
                    {/* <Select
                        label="User Type"
                        options={[
                            { value: 0, label: "Normal User" },
                            { value: 1, label: "Vehicle Dealer" },
                        ]}
                    /> */}
                </div>
                <div className="divider mt-8">Location Details</div>
                <div className="grid w-full gap-1 lg:grid-cols-2">
                    {/* <Input label="City" required placeholder="Colombo" />
                    <Input label="State" required placeholder="Western Province" />
                    <Input label="Country" required placeholder="Sri Lanka" />
                    <Input label="Postal Code" required placeholder="00001" /> */}
                </div>

                <div className="mt-3 flex justify-end">
                    <button type="submit" className="btn-neutral btn-wide btn">
                        Save
                    </button>
                </div>
            </div>
        </>
    );
}
