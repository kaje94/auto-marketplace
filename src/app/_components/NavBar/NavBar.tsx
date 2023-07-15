"use server";
import Link from "next/link";
import { authOptions } from "@/auth/authConfig";
import { getServerSession } from "next-auth";
import { NavBarLogoutButton, NavBarLoginButton } from "./NavBarButtons";

export const NavBar = async () => {
    const session = await getServerSession(authOptions);
    return (
        <div className="navbar rounded-2xl  border-2 bg-base-100">
            <Link href="/" className="flex-1">
                <button className="btn-ghost btn text-xl normal-case">Car Sale</button>
            </Link>
            <button className="btn-primary btn mr-4">Post your Ad</button>

            <div className="flex-none">
                {session ? (
                    <div className="dropdown-end dropdown">
                        <label tabIndex={0} className="btn-ghost btn-circle avatar btn">
                            <div className="w-10 rounded-full">
                                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI8DK8HCuvWNyHHg8enmbmmf1ue4AeeF3GDw&usqp=CAU" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow-xl">
                            <li>
                                <Link href="/dashboard">Dashboard</Link>
                            </li>
                            <NavBarLogoutButton />
                        </ul>
                    </div>
                ) : (
                    <NavBarLoginButton />
                )}
            </div>
        </div>
    );
};
