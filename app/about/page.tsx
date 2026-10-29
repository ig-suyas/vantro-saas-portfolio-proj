import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ContourArt, Portrait } from "@/components/about/contour-art";
import { InView, MaskLines } from "@/components/in-view";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "About",
  description: "Vantro is built by former sales ops and data people who think a forecast should show its work. Our principles, team and open roles.",
  alternates: { canonical: "/about" },
};

const principles = [
  { title: "Every number travels with its range.", body: "A single figure hides how sure you are. Every forecast in Vantro carries its range, and the range is honest about how much pipeline is still open." },
  { title: "Every score explains itself.", body: "If a manager can't see why a deal is at 64%, they won't trust it, and they shouldn't. Reasons sit next to every number." },
  { title: "Reps shouldn't feed the model.", body: "We read what already happens: meetings, emails, stage changes. Nobody is asked to fill in another field so a forecast can exist." },
  { title: "Keep score on ourselves.", body: "Vantro records every forecast it makes. At quarter end you see how close it was, next to how close your team's call was." },
];

const team = [
  { name: "Maya Okafor", role: "Co-founder, CEO", note: "Ran sales operations for a 200-seller team." },
  { name: "Daniel Reyes", role: "Co-founder, CTO", note: "Built pricing models in insurance before this." },
  { name: "Priya Nair", role: "Head of Data Science", note: "Works on calibration and forecast ranges." },
  { name: "Sam Whitfield", role: "Design Lead", note: "Designs the charts you'll stare at on Mondays." },
  { name: "Leah Brennan", role: "Customer Engineering", note: "Leads setup and CRM mapping reviews." },
  { name: "Jonah Patel", role: "Account Executive", note: "Yes, he is forecast by Vantro too." },
];

const roles = [
  { title: "Senior ML Engineer, Forecasting", place: "Remote, US" },
  { title: "Product Designer, Data Visualization", place: "Austin or remote, US" },
  { title: "Solutions Engineer", place: "Chicago, hybrid" },
];

const initials = (n: string) => n.split(" ").map((p) => p[0]).join("");

export default function AboutPage() {
  return (
    <>
      <section className="container-x pt-12 pb-14 md:pt-20 md:pb-20">
        <p className="eyebrow text-muted">About</p>
        <h1 className="mt-5 max-w-5xl font-display text-display-xl">
          <MaskLines lines={["A forecast should", <span key="2">show <span className="italic">its work.</span></span>]} />
        </h1>
      </section>

      <figure className="container-x">
        <div className="overflow-hidden rounded-lg">
          <ContourArt />
        </div>
        <figcaption className="mt-3 text-sm text-muted">Thirteen weeks of a quarter as contour lines. The orange one is the forecast.</figcaption>
      </figure>

      <section aria-labelledby="story-heading" className="container-x grid gap-10 py-20 md:py-32 lg:grid-cols-12">
        <h2 id="story-heading" className="eyebrow text-muted lg:col-span-3">
          Why Vantro exists
        </h2>
        <div className="space-y-6 text-lead text-ink-2 lg:col-span-7">
          <p className="font-display text-display-s text-ink">
            Vantro started as a spreadsheet one sales ops team rebuilt every Thursday night, so their CRO had something
            to say on Friday.
          </p>
          <p>
            The spreadsheet worked until it didn&apos;t. Rep calls came in optimistic, managers trimmed them by feel, and by
            the board meeting nobody could explain the number. So we started scoring deals from what was actually
            happening on them, and showing how unsure that score was.
          </p>
          <p>
            We are a small team in Austin, spread across four US time zones, building for the people who own a revenue
            number and have to defend it.
          </p>
        </div>
      </section>

      <section id="principles" aria-labelledby="principles-heading" className="scroll-mt-24 border-t border-line bg-paper-2">
        <div className="container-x py-20 md:py-32">
          <InView as="h2" reveal="mask" id="principles-heading" className="font-display text-display-m">
            <MaskLines lines={["Four things we", "won't trade away."]} />
          </InView>
          <ol className="mt-14 md:mt-20">
            {principles.map((p, i) => (
              <li key={p.title} className="grid gap-4 border-t border-ink/80 py-8 md:grid-cols-12 md:gap-8 md:py-12">
                <span className="tabular font-display text-[3.5rem] leading-none text-pine md:col-span-2">0{i + 1}</span>
                <h3 className="font-display text-display-s md:col-span-5">{p.title}</h3>
                <p className="max-w-md text-ink-2 md:col-span-5">{p.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="team-heading" className="container-x py-20 md:py-32">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="team-heading" className="font-display text-display-m lg:col-span-6">
            The team
          </h2>
          <p className="max-w-md text-ink-2 lg:col-span-4 lg:col-start-9 lg:self-end">
            Sales ops, data science and design, in roughly equal parts.
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-6">
          {team.map((m, i) => (
            <li key={m.name} className={i % 2 === 1 ? "lg:mt-12" : ""}>
              <div className="overflow-hidden rounded-md">
                <Portrait initials={initials(m.name)} variant={i} />
              </div>
              <p className="mt-4 font-medium">{m.name}</p>
              <p className="text-sm text-ink-2">{m.role}</p>
              <p className="mt-2 text-sm text-muted">{m.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="careers" aria-labelledby="careers-heading" className="scroll-mt-24 border-t border-line">
        <div className="container-x grid gap-10 py-20 md:py-28 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="careers-heading" className="font-display text-display-s">
              Open roles
            </h2>
            <p className="mt-3 max-w-sm text-ink-2">Small team, real ownership, and a forecast on everything we ship.</p>
          </div>
          <ul className="border-t border-ink lg:col-span-7 lg:col-start-6">
            {roles.map((r) => (
              <li key={r.title} className="border-b border-line">
                <a
                  href={`mailto:careers@vantro.example?subject=${encodeURIComponent(r.title)}`}
                  className="group flex min-h-20 flex-wrap items-center justify-between gap-x-6 gap-y-1 py-5 transition-colors hover:text-pine"
                >
                  <span className="text-[1.0625rem] font-medium">{r.title}</span>
                  <span className="flex items-center gap-3 text-sm text-ink-2">
                    {r.place}
                    <ArrowUpRight className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
