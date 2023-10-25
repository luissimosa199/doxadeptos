import { faHouse, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import React, { FunctionComponent } from "react";

const buttons = [
  {
    icon: faNewspaper,
    href: "blog",
    name: "Blog",
    color: "bg-sky-400",
  },
  {
    icon: faHouse,
    href: "properties",
    name: "Properties",
    color: "bg-emerald-400",
  },
];

const ProfileButtonsPanel: FunctionComponent = () => {
  return (
    <ul>
      {buttons.map((e, idx) => {
        return (
          <li
            key={idx}
            className="underline text-lg mb-2 hover:opacity-70"
          >
            <Link href={e.href}>{e.name}</Link>
          </li>
        );
      })}
    </ul>
  );
};

export default ProfileButtonsPanel;
