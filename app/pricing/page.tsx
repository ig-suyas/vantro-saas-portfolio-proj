import type { Metadata } from "next";
import { Check, Minus, Plus } from "lucide-react";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { MaskLines } from "@/components/in-view";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Vantro is priced per seller with no platform fee. Team, Growth and Enterprise plans, monthly or annual.",
  alternates: { canonical: "/pricing" },
};

type Cell = boolean | string;
const rows: { group: string; items: [string, Cell, Cell, Cell][] }[] = [
  {
    group: "Forecasting",
    items: [
      ["Daily deal scoring with reasons", true, true, true],
      ["Forecast with 80% range", true, true, true],
      ["Rep, team and company roll-ups", false, true, true],
      ["Scenario planner", false, true, true],
      ["Forecast accuracy history", "Current quarter", "8 quarters", "Unlimited"],
    ],
  },
  {
    group: "Data",
    items: [
      ["CRM connections", "1", "2", "Unlimited"],
      ["Email and calendar signals", false, true, true],
      ["Custom segments and fiscal calendars", false, false, true],
      ["Sandbox environment", false, false, true],
    ],
  },
  {
    group: "Admin and support",
    items: [
      ["Viewer seats for managers and execs", true, true, true],
      ["SSO, SAML and SCIM", false, false, true],
      ["Support", "Email", "Email and chat", "Named manager"],
    ],
  },
];

const faqs = [
  {
    q: "Who counts as a seller?",
    a: "Anyone who owns open opportunities in your CRM. Managers, RevOps, finance and executives get viewer seats at no cost.",
  },
  {
    q: "How long does setup take?",
    a: "Connecting the CRM takes an afternoon. The first scores need your closed-deal history and are ready within two business days.",
  },
  {
    q: "Is there a free trial?",
    a: "We run a two-week pilot on your real pipeline instead of a self-serve trial. A forecast is only worth judging on your own data.",
  },
  {
    q: "What if our CRM data is messy?",
    a: "Most is. During setup Vantro reports which fields it can't rely on, and scores lean on activity signals where fields are thin.",
  },
  {
    q: "Can we cancel?",
    a: "Monthly plans cancel at any time. Annual plans are billed up front and can be cancelled before renewal.",
  },
];

function CellValue({ v }: { v: Cell }) {
  if (v === true) return <Check className="mx-auto size-4 text-pine" strokeWidth={2.4} aria-label="Included" />;
  if (v === false) return <Minus className="mx-auto size-4 text-ink/35" aria-label="Not included" />;
  return <span className="text-[0.8125rem] text-ink-2 sm:text-sm">{v}</span>;
}

export default function PricingPage() {
  return (
    <>
      <section className="container-x pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-muted">Pricing</p>
            <h1 className="mt-5 font-display text-display-l">
              <MaskLines lines={["Priced per seller.", "No platform fee."]} />
            </h1>
          </div>
          <p className="max-w-md text-lead text-ink-2 lg:col-span-4">
            Pay for the people who carry a number. Everyone who reads the forecast gets in free.
          </p>
        </div>
        <div className="mt-14">
          <PricingPlans />
        </div>
      </section>

      <section aria-labelledby="compare-heading" className="border-t border-line">
        <div className="container-x py-20 md:py-28">
          <h2 id="compare-heading" className="font-display text-display-m">
            Compare plans
          </h2>
          <table className="mt-10 w-full table-fixed border-collapse text-left">
            <caption className="sr-only">Features included in each plan</caption>
            <colgroup>
              <col className="w-[46%] sm:w-[52%]" />
              <col />
              <col />
              <col />
            </colgroup>
            <thead className="sticky top-16 z-10 bg-paper md:top-[72px]">
              <tr className="border-b border-ink">
                <th scope="col" className="py-4 text-sm font-normal text-muted">
                  Feature
                </th>
                {["Team", "Growth", "Enterprise"].map((p) => (
                  <th key={p} scope="col" className="py-4 text-center text-sm font-medium sm:text-base">
                    {p === "Enterprise" ? (
                      <>
                        <span className="sm:hidden" aria-hidden="true">Ent.</span>
                        <span className="max-sm:sr-only">Enterprise</span>
                      </>
                    ) : (
                      p
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            {rows.map((g) => (
              <tbody key={g.group}>
                <tr>
                  <th scope="rowgroup" colSpan={4} className="eyebrow pt-10 pb-3 text-muted">
                    {g.group}
                  </th>
                </tr>
                {g.items.map(([label, ...cells]) => (
                  <tr key={label} className="border-b border-line">
                    <th scope="row" className="py-4 pr-3 text-[0.9375rem] font-normal">
                      {label}
                    </th>
                    {cells.map((c, i) => (
                      <td key={i} className="py-4 text-center">
                        <CellValue v={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-24 border-t border-line bg-paper-2">
        <div className="container-x grid gap-10 py-20 md:py-28 lg:grid-cols-12">
          <h2 id="faq-heading" className="font-display text-display-m lg:col-span-4">
            Questions buyers ask
          </h2>
          <div className="border-t border-ink lg:col-span-7 lg:col-start-6">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-line">
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.0625rem] font-medium transition-colors hover:text-pine [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus className="size-5 shrink-0 transition-transform duration-300 ease-[var(--ease-out-expo)] group-open:rotate-45" strokeWidth={1.75} aria-hidden="true" />
                </summary>
                <p className="max-w-xl animate-[fade_400ms_ease-out] pb-6 text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={["Not sure which plan?", "Start with a pilot."]} body="Two weeks on your real pipeline. You keep the forecast either way." />
    </>
  );
}
