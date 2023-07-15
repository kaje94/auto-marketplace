"use client";
import { signIn, signOut } from "next-auth/react";

export const NavBarLoginButton = () => {
    return (
        <button className="btn-primary btn mr-4" onClick={() => signIn("duende-identityserver6")}>
            Login
        </button>
    );
};

export const NavBarLogoutButton = () => {
    return (
        <li onClick={() => signOut()}>
            <a>Logout</a>
        </li>
    );
};
