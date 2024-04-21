import { NavLink } from "./types";

export const links: NavLink[] = [
    {
        title: 'Home',
        href: '/',
    },
    {
        title: 'Solutions',
        href: '#',
        children: [
            {
                title: 'Business Line of Credit',
                href: '#',
            },
            {
                title: 'SBA Loan',
                href: '#',
            },
            {
                title: 'Revenue Based Financing',
                href: '#',
            },
            {
                title: 'Invoice Factoring',
                href: '#',
            },
        ],
    },
    {
        title: 'About',
        href: '/about',
    },
    {
        title: 'Contact',
        href: '/contact',
    },
];

export const companyLinks = [
    {
        title: 'About',
        href: '#',
    },
    {
        title: 'Terms of Service',
        href: '#',
    },
    {
        title: 'Privacy Policy',
        href: '#',
    },
    {
        title: 'Cookie Policy',
        href: '#',
    },
];

export const solutionLinks = [
    {
        title: 'Business Line of Credit',
        href: '#',
    },
    {
        title: 'SBA Loan',
        href: '#',
    },
    {
        title: 'Revenue Based Financing',
        href: '#',
    },
    {
        title: 'Invoice Factoring',
        href: '#',
    },
];

export const partnershipLinks = [
    {
        title: 'Loan Partner',
        href: '#',
    },
    {
        title: 'Affiliate',
        href: '#',
    },
    {
        title: 'Brand Guideline',
        href: '#',
    },
];
