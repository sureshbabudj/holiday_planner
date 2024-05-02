import { companyLinks, partnershipLinks, solutionLinks } from "@/data";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="w-full mt-18 bg-slate-50 dark:bg-black">
      <div className="container mx-auto flex flex-col items-start space-y-12 px-8 pb-8 pt-12 md:flex-row md:space-y-0 md:space-x-12 md:px-12">
        <div className="flex w-full flex-col space-y-4 text-center md:w-2/5 md:text-left">
          <Logo />
          <p className="text-sm text-slate-600">
            Our Holiday Planner app allows you to create personalized vacation
            plans tailored to your preferences.
          </p>
        </div>
        <div className="w-full text-center text-slate-600 md:w-1/5 md:text-left">
          <div className="text-sm font-semibold">Company</div>
          <ul className="text-sm">
            {companyLinks.map(({ title, href }, index) => (
              <li className="pt-3" key={index}>
                <a
                  className="underline decoration-transparent underline-offset-4 transition hover:decoration-slate-700"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full text-center text-slate-600 md:w-1/5 md:text-left">
          <div className="text-sm font-semibold">Services</div>
          <ul className="text-sm">
            {solutionLinks.map(({ title, href }, index) => (
              <li className="pt-3" key={index}>
                <a
                  className="underline decoration-transparent underline-offset-4 transition hover:decoration-slate-700"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full text-center text-slate-600 md:w-1/5 md:text-left">
          <div className="text-sm font-semibold text-slate-600">
            Partnership
          </div>
          <ul className="text-sm">
            {partnershipLinks.map(({ title, href }, index) => (
              <li className="pt-3" key={index}>
                <a
                  className="underline decoration-transparent underline-offset-4 transition hover:decoration-slate-700"
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container mx-auto border-t border-slate-200 p-8 text-center text-sm text-slate-600 dark:border-slate-900 md:flex-row md:px-12">
        &copy; {new Date().getFullYear()} HolidayPlanner. All rights reserved.
      </div>
    </footer>
  );
}
