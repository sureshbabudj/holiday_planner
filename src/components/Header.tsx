import { links } from "@/data";
import { NavLink } from "@/types";
import { Logo } from "./Logo";
import { Navigation } from "./Navigation";
import React from "react";
import Link from "next/link";

interface HeaderProps {
  navLinks?: NavLink[];
}

export function Header({ navLinks = links }: HeaderProps) {
  return (
    <header className="container flex w-full items-center justify-between py-4 px-6">
      <Link href="/">
        <Logo />
      </Link>
      <Navigation navLinks={navLinks} />
      <Navigation mobile navLinks={navLinks} />
    </header>
  );
}
