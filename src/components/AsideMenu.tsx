import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faHospitalUser, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

const AsideMenu = () => {
  return (
    <div className="2xl:shadow-md 2xl:block hidden p-4 rounded-lg mt-2">
      <ul className="flex flex-col gap-2">
        <li>
          <Link href="/">
            <FontAwesomeIcon
              icon={faHouse}
              className="mr-2"
            />
            <span>Homepage</span>
          </Link>
        </li>
        <li>
          <Link href="/properties">
            <FontAwesomeIcon
              icon={faHouse}
              className="mr-2"
            />
            <span>Properties</span>
          </Link>
        </li>
        <li>
          <Link href="/contact">
            <FontAwesomeIcon
              icon={faHospitalUser}
              className="mr-2"
            />
            <span>Contact</span>
          </Link>
        </li>
        <li>
          <Link href="/contact">
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="mr-2"
            />
            <span>Whatsapp</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AsideMenu;
