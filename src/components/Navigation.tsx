"use client";

import { NavLink } from "@/types";
import { NavLink as NavLinkComponent } from "./NavLink";
import { ArrowRight, MenuIcon } from "lucide-react";
import React, { useState } from "react";

interface NavigationProps {
  mobile?: boolean;
  navLinks?: NavLink[];
}

export function Navigation({ mobile = false, navLinks = [] }: NavigationProps) {
  const [mobileNavigationOpened, setMobileNavigationOpened] = useState(false);

  const navClassName = `
      text-base 
      ${mobile ? "bg-white dark:bg-slate-900" : ""}
      ${
        mobile
          ? `transition transform -right-2/3 fixed top-0 z-20 h-full w-2/3 overflow-y-auto py-4 sm:hidden ${
              mobileNavigationOpened ? "-translate-x-full shadow-2xl" : ""
            }`
          : "hidden sm:block"
      }
    `;
  const navListClassName = `
      flex
      ${mobile ? "flex-col space-y-2" : "items-center space-x-2"}
    `;
  const navListItemClassName = `
      group relative
      ${mobile ? "w-full overflow-x-visible text-right" : ""}
    `;
  const navListLinkClassName = mobile ? "mx-4" : "";
  const navChildrenClassName = `
      delay-75 ease-in-out space-y-2 
      ${
        mobile
          ? "h-0 overflow-y-hidden bg-slate-50 px-4 py-0 transition-all group-hover:h-full group-hover:py-4 dark:bg-slate-800"
          : "invisible absolute z-30 rounded-lg border border-slate-50 bg-white p-4 opacity-0 shadow-xl transition-opacity group-hover:visible group-hover:opacity-100 dark:bg-slate-900 dark:border-slate-800"
      }
    `;

  const closeMobileNavigation = () => setMobileNavigationOpened(false);

  return (
    <>
      {mobile && (
        <button
          className="block text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 sm:hidden"
          onClick={() => setMobileNavigationOpened(true)}
          title="Open navigation menu"
        >
          <MenuIcon />
        </button>
      )}

      {mobile && mobileNavigationOpened && (
        <div
          className="fixed top-0 right-0 z-10 h-full w-full bg-slate-900 opacity-70 dark:opacity-90 sm:hidden"
          onClick={closeMobileNavigation}
        ></div>
      )}

      <nav className={navClassName}>
        <ul className={navListClassName}>
          {mobile && (
            <li className="text-right">
              <button
                className="px-6 py-2 text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
                onClick={closeMobileNavigation}
              >
                <ArrowRight />
              </button>
            </li>
          )}
          {navLinks.map(({ title, href, children }) => (
            <li className={navListItemClassName} key={title}>
              <NavLinkComponent
                className={navListLinkClassName}
                currentPath="/contact"
                href={href}
              >
                {title}
              </NavLinkComponent>
              {!!children?.length && (
                <ul className={navChildrenClassName}>
                  {children.map((child) => (
                    <li key={child.title}>
                      <NavLinkComponent href={child.href}>
                        {child.title}
                      </NavLinkComponent>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
