import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { ForecastCanvas } from "@/components/home/forecast-canvas";
import { PinnedSequence, StackedSequence } from "@/components/home/pinned-sequence";
import { InView, MaskLines } from "@/components/in-view";
import { CtaBand } from "@/components/cta-band";

const problems = [
  "Rep calls drift optimistic as the quarter closes, and nobody can see by how much.",
  "Slipping deals show up at the forecast call, two weeks after they started slipping.",
  "RevOps rebuilds the same roll-up spreadsheet every Thursday night.",
];

const roles = [
  {
    role: "CROs and VPs of Sales",
    body: "One company number with a range you can take to the board, and the handful of deals that move it most.",
    opens: "Company roll-up",
    href: "/product#rollups",
  },
  {
    role: "Front-line managers",
    body: "A deal-by-deal view of where your reps' calls and the model disagree, before the Monday forecast call.",
    opens: "Deal inspector",
    href: "/product#scoring",
  },
  {
    role: "Revenue operations",
    body: "No weekly roll-up spreadsheet. Every forecast is kept, so you can see how accurate each call was, quarter after quarter.",
    opens: "Scenario planner",
    href: "/product#scenarios",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="container-x pt-10 pb-20 md:pt-14 lg:pb-28">
        <p className="eyebrow text-muted">Revenue forecasting for B2B sales teams</p>
        <h1 className="mt-5 max-w-[15ch] font-display text-display-l md:max-w-none">
          <MaskLines lines={["Call the quarter with a", "number you can defend."]} />
        </h1>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col lg:col-span-4 lg:pt-2">
            {/* No entry animation here: this paragraph is the LCP element on phones */}
            <p className="max-w-md text-lead text-ink-2">
              Vantro reads every open deal in your CRM, scores how likely it is to close this quarter, and rolls it all
              into a forecast with an honest range around it.
            </p>
            <div className="mt-8 flex animate-[fade_800ms_320ms_ease-out_both] flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href="/demo">Book a demo</ButtonLink>
              <ButtonLink href="/product" variant="ghost">
                See the product
              </ButtonLink>
            </div>

            <dl className="mt-auto hidden max-w-sm gap-4 border-t border-line pt-6 text-sm lg:mt-16 lg:grid">
              <div className="grid grid-cols-[auto_1fr] gap-x-4">
                <dt className="tabular text-muted">01</dt>
                <dd className="text-ink-2">Grey dots are open deals before scoring. Size is deal value.</dd>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-4">
                <dt className="tabular text-muted">02</dt>
                <dd className="text-ink-2">Each deal settles into closed, forecast, or at risk.</dd>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-x-4">
                <dt className="tabular text-muted">03</dt>
                <dd className="text-ink-2">Hover any dot or week once it lands to inspect it.</dd>
              </div>
            </dl>
          </div>

          <div className="h-[640px] animate-[fade_900ms_150ms_ease-out_both] sm:h-[560px] lg:col-span-8 lg:h-[clamp(440px,calc(100svh-390px),620px)]">
            <ForecastCanvas />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section aria-labelledby="problem-heading" className="border-t border-line bg-paper-2">
        <div className="container-x grid gap-10 py-20 md:py-32 lg:grid-cols-12">
          <p className="eyebrow text-muted lg:col-span-3">The problem</p>
          <div className="lg:col-span-9">
            <InView as="h2" reveal="mask" id="problem-heading" className="font-display text-display-m">
              <MaskLines
                lines={[
                  "Most forecasts are gut calls,",
                  "adjusted by managers, then adjusted",
                  <span key="l3" className="italic text-pine">again by finance.</span>,
                ]}
              />
            </InView>
            <p className="mt-6 max-w-2xl text-lead text-ink-2">
              By the time the number reaches the board, nobody can say why it is what it is, or how wrong it might be.
            </p>
            <InView as="ul" reveal="rule" className="mt-14 grid gap-8 md:mt-20 md:grid-cols-3">
              {problems.map((p, i) => (
                <li key={p} style={{ ["--i" as string]: i }}>
                  <span className="rule block h-px bg-ink" aria-hidden="true" />
                  <p className="tabular mt-4 text-sm text-muted">0{i + 1}</p>
                  <p className="mt-2 text-ink-2">{p}</p>
                </li>
              ))}
            </InView>
          </div>
        </div>
      </section>

      <PinnedSequence />
      <StackedSequence />

      {/* Roles */}
      <section aria-labelledby="roles-heading" className="border-t border-line">
        <div className="container-x py-20 md:py-32">
          <div className="grid gap-6 lg:grid-cols-12">
            <InView as="h2" reveal="mask" id="roles-heading" className="font-display text-display-m lg:col-span-7">
              <MaskLines lines={["Built for the people", "who own the number."]} />
            </InView>
            <p className="max-w-md text-ink-2 lg:col-span-4 lg:col-start-9 lg:self-end">
              Everyone sees the same forecast. What changes is where they start.
            </p>
          </div>

          <ul className="mt-14 border-t border-ink md:mt-20">
            {roles.map((r) => (
              <li key={r.role} className="border-b border-line">
                <Link
                  href={r.href}
                  className="group grid gap-3 py-7 transition-colors duration-300 hover:bg-paper-2 md:grid-cols-12 md:items-baseline md:gap-8 md:px-4 md:py-9"
                >
                  <span className="font-display text-display-s md:col-span-4">{r.role}</span>
                  <span className="text-ink-2 md:col-span-5">{r.body}</span>
                  <span className="flex items-center gap-2 text-sm font-medium md:col-span-3 md:justify-end">
                    <span className="text-muted">Opens</span> {r.opens}
                    <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Fit */}
      <section aria-labelledby="fit-heading" className="border-t border-line bg-paper-2">
        <div className="container-x grid gap-12 py-20 md:grid-cols-2 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="fit-heading" className="font-display text-display-s">
              Sits on top of the CRM you already run.
            </h2>
            <p className="mt-4 max-w-md text-ink-2">
              Vantro connects with read-only access and never writes back to your records. Setup is a connection and a
              mapping review with your RevOps lead.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 text-sm lg:col-span-6 lg:col-start-7">
            <div>
              <dt className="eyebrow text-muted">CRM</dt>
              <dd className="mt-3 space-y-1 text-ink-2">
                <p>Salesforce</p>
                <p>HubSpot</p>
                <p>Microsoft Dynamics 365</p>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-muted">Activity</dt>
              <dd className="mt-3 space-y-1 text-ink-2">
                <p>Google Workspace</p>
                <p>Microsoft 365</p>
                <p>Call recorders via export</p>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-muted">Access</dt>
              <dd className="mt-3 text-ink-2">Read-only, scoped to the objects you choose.</dd>
            </div>
            <div>
              <dt className="eyebrow text-muted">History</dt>
              <dd className="mt-3 text-ink-2">Scores use your last eight quarters of closed deals.</dd>
            </div>
          </dl>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
