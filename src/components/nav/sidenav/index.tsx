"use client";

// import clsx from "clsx";
// import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react";
import Navigation from "./component/navigation";
function SideNav() {
  return (
    <>
      <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <Navigation />
      </ul>
    </>
  );
}

export default SideNav;
