import type { Metadata } from "next";
import { Check, Minus, Plus } from "lucide-react";
import { DashboardMock } from "@/components/product/dashboard-mock";
import { ScenarioPlanner } from "@/components/product/scenario-planner";
import { RollupVisual } from "@/components/home/step-visuals";
import { InView, MaskLines } from "@/components/in-view";
import { CtaBand } from "@/components/cta-band";
import { ButtonLink } from "@/components/button";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Deal scoring with reasons, forecasts with ranges, roll-ups by team, a scenario planner and a Monday risk digest. See how Vantro builds a forecast.",
  alternates: { canonical: "/product" },
};

const signals = [
  { sign: "+", pts: 9, text: "Economic buyer joined the last two calls" },
  { sign: "+", pts: 5, text: "Mutual plan shared and updated this week" },
  { sign: "+", pts: 3, text: "Security questionnaire returned" },
  { sign: "−", pts: 6, text: "Close date moved out once this quarter" },
  { sign: "−", pts: 4, text: "Legal contact not yet identified" },
];

const principles = [
  { title: "Read-only by design", body: "Vantro never writes to your CRM. Access is scoped to the objects you approve during setup." },
  { title: "Your data trains your model", body: "Scores are fit on your own closed deals. Nothing is pooled across customers." },
  { title: "Delete on request", body: "Disconnect and every synced record and derived score is removed within 30 days." },
  { title: "Every score is explainable", body: "No black-box numbers. Each probability lists the signals that moved it and by how much." },
];

export default function ProductPage() {
  return (
    <>
      <section className="container-x pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="eyebrow text-muted">Product</p>
            <h1 className="mt-5 font-display text-display-l">
              <MaskLines lines={["One forecast,", "built from every deal."]} />
            </h1>
          </div>
          <p className="max-w-md text-lead text-ink-2 lg:col-span-4">
            Five pieces that work together: deal scoring, ranges, roll-ups, scenarios and a weekly digest. Here is what
            each one does.
          </p>
        </div>
        <div className="mt-12 md:mt-16">
          <DashboardMock />
        </div>
      </section>

      {/* Scoring */}
      <section id="scoring" aria-labelledby="scoring-heading" className="scroll-mt-24 border-t border-line">
        <div className="container-x grid gap-12 py-20 md:py-32 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow text-muted">01 · Deal scoring</p>
            <InView as="h2" reveal="mask" id="scoring-heading" className="mt-4 font-display text-display-m">
              <MaskLines lines={["A probability", "that shows its work."]} />
            </InView>
            <p className="mt-6 max-w-md text-ink-2">
              Each open deal gets a probability of closing this quarter, refreshed every morning from CRM fields and
              activity. Next to every score is the list of signals that moved it, weighted, in plain language.
            </p>
            <ul className="mt-8 space-y-3 text-ink-2">
              {["Scores update daily, not at the forecast call", "Managers can override, and the override is logged", "Accuracy is tracked per rep, team and stage"].map((t) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-pine" strokeWidth={2.2} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <article className="rounded-lg border border-line bg-surface p-5 shadow-frame sm:p-7" aria-label="Example deal score, sample data">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">Tidewater Systems · Expansion</p>
                  <p className="tabular mt-1 text-sm text-ink-2">$186K · Negotiation · Owner J. Alvarez</p>
                </div>
                <span className="rounded-sm bg-pine-soft px-2 py-1 text-[0.75rem] font-medium text-pine">Up 6 this week</span>
              </div>
              <div className="mt-6 flex items-end gap-4">
                <p className="tabular font-display text-[5rem] leading-[0.85] tracking-tight">81%</p>
                <p className="pb-2 text-sm text-ink-2">likely to close by Dec 31</p>
              </div>
              <div className="relative mt-5 h-2 overflow-hidden rounded-full bg-paper-3">
                <span className="absolute inset-0 origin-left scale-x-[0.81] rounded-full bg-pine" />
              </div>
              <ul className="mt-6 divide-y divide-line border-t border-line">
                {signals.map((s) => (
                  <li key={s.text} className="flex items-center gap-3 py-3 text-sm">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-sm ${s.sign === "+" ? "bg-pine-soft text-pine" : "bg-[#f6dfd6] text-signal-ink"}`}
                    >
                      {s.sign === "+" ? <Plus className="size-3.5" aria-label="raises score" /> : <Minus className="size-3.5" aria-label="lowers score" />}
                    </span>
                    <span className="flex-1 text-ink-2">{s.text}</span>
                    <span className="tabular text-muted">{s.pts} pts</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* Scenarios (dark) */}
      <section id="scenarios" aria-labelledby="scenarios-heading" className="on-dark scroll-mt-24 bg-ink text-paper">
        <div className="container-x grid gap-12 py-20 md:py-32 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="eyebrow text-paper/60">02 · Scenario planner</p>
            <InView as="h2" reveal="mask" id="scenarios-heading" className="mt-4 font-display text-display-m">
              <MaskLines lines={["Ask what if,", "before the board does."]} />
            </InView>
            <p className="mt-6 max-w-md text-paper/80">
              Slip a big deal into next quarter or move win rates, and watch the number and its range respond. Try it:
              this one runs on sample data.
            </p>
          </div>
          <div className="lg:col-span-8">
            <ScenarioPlanner />
          </div>
        </div>
      </section>

      {/* Roll-ups */}
      <section id="rollups" aria-labelledby="rollups-heading" className="scroll-mt-24">
        <div className="container-x grid gap-12 py-20 md:py-32 lg:grid-cols-12 lg:items-center">
          <div className="order-last lg:order-first lg:col-span-7">
            <RollupVisual active />
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="eyebrow text-muted">03 · Roll-ups</p>
            <InView as="h2" reveal="mask" id="rollups-heading" className="mt-4 font-display text-display-m">
              <MaskLines lines={["Where the model", "and managers disagree."]} />
            </InView>
            <p className="mt-6 text-ink-2">
              Forecasts roll up rep to team to company, each with a range. The manager&apos;s call sits next to
              Vantro&apos;s, and any gap over $100K is flagged before the forecast call, so the conversation starts
              with specific deals.
            </p>
          </div>
        </div>
      </section>

      {/* Digest */}
      <section aria-labelledby="digest-heading" className="border-t border-line bg-paper-2">
        <div className="container-x grid gap-12 py-20 md:py-32 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-muted">04 · Monday digest</p>
            <h2 id="digest-heading" className="mt-4 font-display text-display-s">
              The week&apos;s risk, in the inbox by 7 AM.
            </h2>
            <p className="mt-4 text-ink-2">
              Each manager gets one email: deals that slipped into risk, why, and the next step that would move them back.
              It links straight to the deal.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="rounded-lg border border-line bg-surface shadow-frame" role="img" aria-label="Sample Monday digest email listing three at-risk deals with reasons and next steps.">
              <div className="space-y-1 border-b border-line px-5 py-4 text-sm sm:px-7" aria-hidden="true">
                <p><span className="inline-block w-16 text-muted">From</span>Vantro digest</p>
                <p><span className="inline-block w-16 text-muted">To</span>Dana Brooks, Enterprise East</p>
                <p className="font-medium"><span className="inline-block w-16 font-normal text-muted">Subject</span>3 deals moved to at risk ($251K)</p>
              </div>
              <div className="px-5 py-6 text-[0.9375rem] sm:px-7" aria-hidden="true">
                <p className="text-ink-2">Morning Dana. Your team forecast is <span className="tabular font-medium text-ink">$2.31M</span>, down $40K from last week. Three deals drove the change:</p>
                <ol className="mt-5 divide-y divide-line border-y border-line">
                  {[
                    ["Meridian Hotels", "$120K", "Procurement step missing from the mutual plan."],
                    ["Arden Insurance", "$77K", "Champion changed roles. No new contact added."],
                    ["Ridgeway Foods", "$54K", "Product usage down 31% over 60 days."],
                  ].map(([n, a, r], i) => (
                    <li key={n} className="grid grid-cols-[auto_1fr_auto] gap-x-4 py-3.5">
                      <span className="tabular text-muted">{i + 1}</span>
                      <span>
                        <span className="block font-medium">{n}</span>
                        <span className="block text-sm text-ink-2">{r}</span>
                      </span>
                      <span className="tabular text-sm">{a}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-sm text-pine underline decoration-pine/40 underline-offset-4">Open the team inspector</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data principles */}
      <section aria-labelledby="data-heading">
        <div className="container-x py-20 md:py-32">
          <div className="grid gap-6 lg:grid-cols-12">
            <h2 id="data-heading" className="font-display text-display-m lg:col-span-6">
              How Vantro treats your data.
            </h2>
            <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
              <ButtonLink href="/demo" variant="secondary">
                Ask about security
              </ButtonLink>
            </div>
          </div>
          <InView as="ul" reveal="rule" className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {principles.map((p, i) => (
              <li key={p.title} style={{ ["--i" as string]: i }}>
                <span className="rule block h-px bg-ink" aria-hidden="true" />
                <h3 className="mt-5 text-[1.1875rem] font-medium">{p.title}</h3>
                <p className="mt-2 max-w-md text-ink-2">{p.body}</p>
              </li>
            ))}
          </InView>
        </div>
      </section>

      <CtaBand title={["Bring one quarter.", "We'll show you the range."]} body="We walk through a forecast built on a sample shaped like your pipeline, then answer the hard questions." />
    </>
  );
}
