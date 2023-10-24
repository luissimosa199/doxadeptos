import Link from "next/link";
import React from "react";
import WhatsAppBtn from "./WhatsAppBtn";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row md:justify-around p-10 bg-base-200 text-base-content relative">
      {/* <WhatsAppBtn tlf={1156160290} /> */}
      <div className="flex flex-col gap-2 mb-2 md:mb-4">
        <Link href="/">
          <span className="hover:underline">Homepage</span>
        </Link>

        <Link href="/profile">
          <span className="hover:underline">Profile</span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-2 md:mb-4">
        <Link href="/videocall">
          <span className="hover:underline">Start videocall</span>
        </Link>

        <Link href="/properties">
          <span className="hover:underline">Properties</span>
        </Link>
      </div>

      <div className="flex flex-col gap-2 mb-2 md:mb-4">
        <Link href="/videocall">
          <span className="hover:underline">Videocalls</span>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
