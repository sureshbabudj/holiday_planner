import { NavLink } from "./types";

/* ---------- config ---------- */
export const AUTH_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];
export const PUBLIC_PATHS = [...AUTH_PATHS, "/"];
export const PUBLIC_PREFIX = /^\/(_next|static|favicon|api\/)/;

export const links: NavLink[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "My Profile",
    href: "#",
    children: [
      {
        title: "2023",
        href: "#",
      },
      {
        title: "2024",
        href: "#",
      },
      {
        title: "2025",
        href: "#",
      },
      {
        title: "2026",
        href: "#",
      },
    ],
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Contact",
    href: "/contact",
  },
];

export const companyLinks = [
  {
    title: "About",
    href: "#",
  },
  {
    title: "Terms of Service",
    href: "#",
  },
  {
    title: "Privacy Policy",
    href: "#",
  },
  {
    title: "Cookie Policy",
    href: "#",
  },
];

export const solutionLinks = [
  {
    title: "Planning Trips",
    href: "#",
  },
  {
    title: "Utilize holidays",
    href: "#",
  },
  {
    title: "Discover the places",
    href: "#",
  },
  {
    title: "Save and share",
    href: "#",
  },
];

export const partnershipLinks = [
  {
    title: "Google Places",
    href: "#",
  },
  {
    title: "Nager",
    href: "#",
  },
  {
    title: "Open AI",
    href: "#",
  },
];
