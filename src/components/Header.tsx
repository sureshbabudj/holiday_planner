import { links } from "@/data";
import { NavLink } from "@/types";
import { Logo } from "./Logo";
import { Navigation } from "./Navigation";
import React from "react";

interface HeaderProps {
  navLinks?: NavLink[];
}

export function Header({ navLinks = links }: HeaderProps) {
  return (
    <header className="container mx-auto flex w-full items-center justify-between py-4 px-6">
      <a href="/">
        <Logo />
      </a>
      <Navigation navLinks={navLinks} />
      <Navigation mobile navLinks={navLinks} />
    </header>
  );
}
