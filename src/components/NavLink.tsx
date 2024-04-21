import React from "react";

interface NavLinkProps extends React.HTMLProps<HTMLLinkElement> {
  currentPath?: string;
}

export function NavLink({
  children,
  className,
  currentPath,
  href,
}: NavLinkProps) {
  return (
    <a
      className={`
          block whitespace-nowrap px-2 py-2 text-sm no-underline transition hover:text-slate-900 dark:hover:text-slate-50
          ${
            currentPath === href
              ? "text-slate-900 dark:text-slate-50"
              : "text-slate-600"
          }
          ${className}
        `}
      href={href}
    >
      {children}
    </a>
  );
}
