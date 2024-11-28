"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Chip,
} from "@nextui-org/react";
import TFTPlannerLogo from "./TFTPlannerLogo";
import TwitterLink from "./TwitterLink";

export default function App() {
  return (
    <nav className="flex w-full justify-between max-w-7xl px-8 py-2 mx-auto">
      <div className="flex items-center">
        <TFTPlannerLogo />
        <h1 className="font-bold text-xl">tftplanner</h1>
        <Chip variant="flat" size="sm" className="bg-blue-600/20 text-blue-500">
          Alpha
        </Chip>
      </div>
      <div className="flex items-center">
        <TwitterLink />
      </div>
    </nav>
  );
}
