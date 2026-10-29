import type { Metadata } from "next";
import { DemoForm } from "@/components/demo/demo-form";
import { Portrait } from "@/components/about/contour-art";
import { MaskLines } from "@/components/in-view";

export const metadata: Metadata = {
  title: "Book a demo",
  description: "Book a 30-minute Vantro walkthrough built around how your team forecasts today.",
  alternates: { canonical: "/demo" },
};

const agenda = [
  { t: "10 min", d: "How your team forecasts today, and where the number goes wrong." },
  { t: "15 min", d: "Vantro on a sample pipeline shaped like yours: scores, ranges, roll-ups." },
  { t: "5 min", d: "Pricing, and whether a two-week pilot makes sense." },
];

export default function DemoPage() {
  return (
    <section className="container-x grid gap-12 pt-12 pb-20 md:pt-20 md:pb-28 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <p className="eyebrow text-muted">Book a demo</p>
        <h1 className="mt-5 font-display text-display-l">
          <MaskLines lines={["Thirty minutes.", "Your pipeline", "in mind."]} />
        </h1>
        <p className="mt-6 max-w-md text-lead text-ink-2">
          Tell us a little about your team and pick a time. We&apos;ll come prepared with a forecast shaped like yours.
        </p>

        <h2 className="mt-12 eyebrow text-muted">What we&apos;ll cover</h2>
        <ol className="mt-4 border-t border-ink">
          {agenda.map((a) => (
            <li key={a.t} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-line py-4">
              <span className="tabular text-sm font-medium">{a.t}</span>
              <span className="text-ink-2">{a.d}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex items-center gap-4">
          <div className="w-14 overflow-hidden rounded-md">
            <Portrait initials="LB" variant={4} />
          </div>
          <p className="text-sm">
            <span className="block font-medium">You&apos;ll meet Leah Brennan</span>
            <span className="text-ink-2">Customer Engineering. She runs every setup review.</span>
          </p>
        </div>
      </div>

      <div className="lg:col-span-7">
        <DemoForm />
      </div>
    </section>
  );
}
