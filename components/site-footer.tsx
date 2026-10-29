import Link from "next/link";
import { Logo } from "./logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Overview" },
      { href: "/product#scoring", label: "Deal scoring" },
      { href: "/product#scenarios", label: "Scenario planner" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/about#principles", label: "Principles" },
      { href: "/about#careers", label: "Careers" },
    ],
  },
  {
    title: "Get started",
    links: [
      { href: "/demo", label: "Book a demo" },
      { href: "/pricing#faq", label: "Pricing FAQ" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="container-x grid gap-12 pt-16 pb-10 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-5">
          <Logo tone="paper" />
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-paper/70">
            Revenue forecasting for B2B sales teams. Every deal scored, every number shown with its range.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="eyebrow text-paper/55">{col.title}</h2>
              <ul className="mt-4 space-y-1">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-flex min-h-11 items-center text-[0.9375rem] text-paper/85 transition-colors hover:text-paper">
                      <span className="link-draw">{l.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="container-x">
        <div className="flex flex-col gap-4 border-t border-paper/15 py-8 text-sm text-paper/65 md:flex-row md:items-center md:justify-between">
          <p>
            <span className="mr-2 inline-flex items-center rounded-sm border border-signal/70 px-1.5 py-0.5 text-[0.6875rem] font-medium tracking-[0.08em] text-signal uppercase">
              Concept
            </span>
            Vantro is a portfolio concept. The product, company, people and data on this site are fictional.
          </p>
          <p className="tabular">© 2026 Vantro concept</p>
        </div>
      </div>
    </footer>
  );
}
