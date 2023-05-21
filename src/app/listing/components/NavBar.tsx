import { FC } from "react";
import Image from "next/image";

export const NavBar: FC = () => (
  <div className="navbar bg-base-100  rounded-2xl border-2">
    <div className="flex-1">
      <a className="btn btn-ghost normal-case text-xl">Car Sale</a>
    </div>
    <button className="btn btn-primary mr-4">Post your Ad</button>

    <div className="flex-none">
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI8DK8HCuvWNyHHg8enmbmmf1ue4AeeF3GDw&usqp=CAU" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-compact dropdown-content mt-3 p-2 shadow-xl bg-base-100 rounded-box w-52"
        >
          <li>
            <a>Dashboard</a>
          </li>
          <li>
            <a>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
);
