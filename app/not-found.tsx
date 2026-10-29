import type { Metadata } from "next";
import { ButtonLink } from "@/components/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[70vh] items-center py-20 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <p className="eyebrow tabular text-muted">Error 404</p>
        <h1 className="mt-5 font-display text-display-l">This page didn&apos;t make the forecast.</h1>
        <p className="mt-6 max-w-md text-lead text-ink-2">
          The link may be old, or the page may have moved. Everything else is right where you left it.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/demo" variant="ghost">
            Book a demo
          </ButtonLink>
        </div>
      </div>
      <svg viewBox="0 0 400 300" className="mt-16 w-full max-w-md lg:col-span-5 lg:mt-0" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="0" x2="400" y1={40 + i * 55} y2={40 + i * 55} stroke="#121416" strokeOpacity="0.08" />
        ))}
        <path d="M10 260 L70 248 L130 230 L190 200 L240 150" fill="none" stroke="#121416" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M240 150 C 270 128, 290 120, 300 122" fill="none" stroke="#e4572e" strokeWidth="3" strokeLinecap="round" />
        <path d="M300 122 L 300 290" fill="none" stroke="#e4572e" strokeWidth="3" strokeDasharray="4 7" strokeLinecap="round" />
        <circle cx="300" cy="122" r="6" fill="#e4572e" stroke="#f3f0e8" strokeWidth="2" />
      </svg>
    </section>
  );
}
